// @flow
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import rfs from "rotating-file-stream";
import elasticsearch from "elasticsearch";
import {
  deleteOldBackgroundSlots,
  getSlots,
  getSlot,
  addSlot,
  deleteSlot,
  deleteAllSlots
} from "./app/slots";
import { initSettings, getSettings, updateSettings } from "./app/settings";
import tv4 from "tv4";
import slotSchema from "./app/slotSchema";
import generatorSlotSchema from "./app/generatorSlotSchema";
import { timeRangeSlotValidate } from "./src/components/timeline/libs/inputValidator";
import { slotsGenerator } from "./src/components/timeline/libs/slotsGenerator";
import "babel-polyfill";
import moment from "moment";

const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 10
});

const elasticUri = process.env.ELASTIC_URI || "http://localhost:9200";
let generatorSlotValidatorAllow = true;
let configurationDocumentId = null;

let client = new elasticsearch.Client({
  host: elasticUri,
  log: {
    type: "file",
    level: ["error"],
    path: "./logs/elasticsearch.log"
  },
  apiVersion: "5.0",
  requestTimeout: 5000,
  keepAlive: true,
  maxSockets: 10
});

client.ping(
  {
    requestTimeout: 5000
  },
  function(error) {
    if (error) {
      console.trace("[Elasticsearch] cluster is down!");
      process.exit();
    }
  }
);

// Remove old background slots
setInterval(() => {
  deleteOldBackgroundSlots(client, (error, response) => {
    if (error) {
      console.log(error);
    }
  });
}, 60000);

const app = express();
const port = process.env.PORT || 3001;

// Body parser and Morgan middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

if (process.env.NODE_ENV !== "test" || process.env.NODE_ENV !== "fillData") {
  app.use(morgan("dev", { stream: accessLogStream }));
}

// We tell express where to find static assets
app.use(express.static(__dirname + "/build"));

// Enable CORS so that we can make HTTP request from webpack-dev-server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let router = express.Router();

// init application
getSettings(client, (error, elastic) => {
  if (error) {
    console.error(error);
  }
  if (elastic !== undefined) {
    if (elastic.responses[0].status === 404) {
      console.log("Index monitor-settings doesn't exist, will be created.");
      initSettings(
        client,
        {
          generatorSlotValidatorAllow: generatorSlotValidatorAllow
        },
        (error, elastic) => {
          if (error) {
            console.error(error);
          }
          configurationDocumentId = elastic._id;
          if (elastic.created === true) {
            console.log("Default setting has been saved");
          }
        }
      );
    } else if (elastic.responses[0].status === 200) {
      let settings = elastic.responses[0].hits.hits[0]._source;
      configurationDocumentId = elastic.responses[0].hits.hits[0]._id;
      generatorSlotValidatorAllow = settings.generatorSlotValidatorAllow;
    }
  }
});

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

router.route("/slots/generator").post((req, res) => {
  let timeSlotsPayload = req.body;
  let _endTime = "";
  let startProcessing = moment();

  // validation
  let validSlot = tv4.validateResult(timeSlotsPayload, generatorSlotSchema);

  if (!validSlot.valid)
    return res.status(500).send({
      message: validSlot.error.message,
      dataPath: validSlot.error.dataPath,
      params: validSlot.error.params
    });

  new Promise((resolve, reject) => {
    getSlots(client, (error, elasticResponse) => {
      if (error) {
        reject(error);
      }
      resolve(elasticResponse);
    });
  })
    .then(timeSlots => {
      let p0 = timeSlots;
      let p1 = slotsGenerator(timeSlotsPayload);
      return Promise.all([p0, p1]);
    })
    .then(data => {
      _endTime = data[1].endTime;
      if (
        data[0].responses[0].hits !== undefined &&
        data[0].responses[0].hits.hits.length !== 0
      ) {
        let promises = data[1].timeSlots.map(generatedSlot => {
          if (generatorSlotValidatorAllow) {
            return timeRangeSlotValidate(
              data[0].responses[0].hits.hits,
              generatedSlot.from,
              generatedSlot.to,
              "background"
            )
              .then(() => {
                generatedSlot["timeRangeSlotValidator"] = true;
                return generatedSlot;
              })
              .catch(err => {
                generatedSlot["timeRangeSlotValidator"] = false;
                generatedSlot["message"] = JSON.stringify(err);
                return generatedSlot;
              });
          } else {
            generatedSlot["timeRangeSlotValidator"] = true;
            return generatedSlot;
          }
        });
        return Promise.all(promises);
      } else {
        let promises = data[1].timeSlots.map(generatedSlot => {
          generatedSlot["timeRangeSlotValidator"] = true;
          return generatedSlot;
        });
        return Promise.all(promises);
      }
    })
    .then(promises => {
      let _promises = promises.map(timeSlot => {
        return new Promise((resolve, reject) => {
          if (timeSlot.timeRangeSlotValidator === true) {
            return addSlot(
              client,
              {
                color: "background",
                type: "background",
                title: timeSlot.title,
                uri: timeSlot.uri,
                from: timeSlot.from,
                to: timeSlot.to
              },
              (error, response) => {
                if (error) {
                  reject({
                    timeSlot: timeSlot,
                    saved: error
                  });
                }
                resolve({
                  timeSlot: timeSlot,
                  saved: response
                });
              }
            );
          } else {
            resolve({
              timeSlot: timeSlot,
              saved: false
            });
          }
        });
      });
      return Promise.all(_promises);
    })
    .then(_promises => {
      return res.json({
        timeSlots: _promises,
        endTime: _endTime,
        processingTime: {
          ms: moment().diff(startProcessing, "miliseconds")
        }
      });
    })
    .catch(err => {
      return res.status(500).end(JSON.stringify(err));
    });
});

router
  .route("/slots")
  .post((req, res) => {
    let valid = tv4.validateResult(req.body, slotSchema);

    if (!valid.valid)
      return res.status(500).send({
        message: valid.error.message,
        dataPath: valid.error.dataPath,
        params: valid.error.params
      });

    getSlots(client, (error, elastic) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }

      // if exists any timeslot
      if (
        elastic.responses[0].hits !== undefined &&
        elastic.responses[0].hits.hits.length !== 0
      ) {
        timeRangeSlotValidate(
          elastic.responses[0].hits.hits,
          req.body.from,
          req.body.to,
          req.body.type
        )
          .then(() => {
            addSlot(client, req.body, (error, response) => {
              if (error) {
                return res.status(500).end(
                  JSON.stringify({
                    elasticsearchError: { message: error.message }
                  })
                );
              }
              res.json({
                elastic: response
              });
            });
          })
          .catch(err => {
            return res.status(500).end(JSON.stringify(err));
          });

        // if don't exist timeslot
      } else {
        addSlot(client, req.body, (error, response) => {
          if (error) {
            return res.status(500).end(
              JSON.stringify({
                elasticsearchError: { message: error.message }
              })
            );
          }
          res.json({
            elastic: response
          });
        });
      }
    });
  })
  .get((req, res) => {
    getSlots(client, (error, response) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }
      res.json({
        elastic: response
      });
    });
  })
  .delete((req, res) => {
    deleteAllSlots(client, (error, response) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }
      res.json({
        elastic: response
      });
    });
  });

router
  .route("/slots/:slot_id")
  .get((req, res) => {
    getSlot(client, req.params.slot_id, (error, response) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }
      res.json({
        elastic: response
      });
    });
  })
  .delete((req, res) => {
    deleteSlot(client, req.params.slot_id, (error, response) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }
      res.json({
        elastic: response
      });
    });
  });

router
  .route("/settings")
  .post((req, res) => {
    console.log(req.body);
    res.json({
      settings: req.body
    });
  })
  .get((req, res) => {
    getSettings(client, (error, response) => {
      if (error) {
        return res.status(500).end(
          JSON.stringify({
            elasticsearchError: { message: error.message }
          })
        );
      }
      res.json({
        elastic: response
      });
    });
  })
  .put((req, res) => {
    updateSettings(
      client,
      configurationDocumentId,
      req.body,
      (error, response) => {
        if (error) {
          return res.status(500).end(
            JSON.stringify({
              elasticsearchError: { message: error.message }
            })
          );
        }
        generatorSlotValidatorAllow = req.body.generatorSlotValidatorAllow;
        res.json({
          elastic: response
        });
      }
    );
  });

app.use("/api", router);

app.listen(port);

console.log(`listening on port ${port}`);

module.exports = app;
