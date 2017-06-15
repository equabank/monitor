// run by command yarn integration

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import moment from "moment";
import tv4 from "tv4";
import schema from "../app/slotSchema";
let should = chai.should();
let slot = null;
let slotCounter = 1;
let lastMinutes = 0;
const numberSlotsGenerated = 100;
const startDateTime = moment()
  .hours(moment().format("HH"))
  .minutes(moment().format("mm"))
  .seconds(0)
  .format("YYYY-MM-DD HH:mm:ss");

const clone = obj => {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};

let getDateTime = {
  from: slotType => {
    let _seconds = 0;
    if (slotType === "background") {
      _seconds = 10;
    } else {
      _seconds = 0;
    }
    return moment(startDateTime)
      .add(lastMinutes, "minutes")
      .add(_seconds, "seconds")
      .format("HH:mm:ss");
  },
  to: slotType => {
    let _seconds = 0;
    if (slotType === "background") {
      _seconds = 30;
    } else {
      _seconds = 0;
      lastMinutes = 1 + lastMinutes;
    }
    return moment(startDateTime)
      .add(lastMinutes, "minutes")
      .add(_seconds, "seconds")
      .format("HH:mm:ss");
  }
};

let slotPayload = {
  from: "06:11:00",
  to: "06:20:00",
  color: "default",
  title: "Application ",
  type: "range",
  uri: "http://"
};

let clonedSlotPayload = clone(slotPayload);

let colors = ["green", "pink", "cyan", "orange", "default"];

const ELASTIC_INDEX_NAME = "monitor-slots";

chai.use(chaiHttp);

let generateRandomSlots = () => {
  let dataProvider = [],
    uris = [
      {
        title: "Application",
        uri: "http://",
        type: "range"
      },
      {
        title: "Api ping",
        uri: "https://",
        type: "background"
      },
      {
        title: "Application 2",
        uri: "http://",
        type: "range"
      }
    ],
    urisPointer = 0,
    colorPointer = 0;
  for (let i = 0; i <= numberSlotsGenerated; i++) {
    dataProvider.push({
      order: i,
      uri: uris[urisPointer].uri,
      title: uris[urisPointer].title,
      color: colors[colorPointer],
      type: uris[urisPointer].type
    });

    urisPointer++;
    if (urisPointer == uris.length) {
      urisPointer = 0;
    }

    colorPointer++;
    if (colorPointer == colors.length) {
      colorPointer = 0;
    }
  }
  return dataProvider;
};

describe("Slots", () => {
  before(done => {
    chai.request(server).get("/api/slots").end((err, res) => {
      res.should.have.status(200);
      if (res.body.elastic.responses[0].status !== 404) {
        chai.request(server).delete("/api/slots/").end((err, res) => {
          res.should.have.status(200);
          done(err);
        });
      } else {
        done(err);
      }
    });
  });

  describe("POST /api/slots", () => {
    generateRandomSlots().forEach(increment => {
      it(`POST a slot ${increment.order} and type ${increment.type}`, done => {
        slotPayload.title = increment.title + " " + slotCounter++;
        slotPayload.from = getDateTime.from(increment.type);
        slotPayload.to = getDateTime.to(increment.type);
        slotPayload.type = increment.type;
        slotPayload.color = increment.type == "range"
          ? "default"
          : "background";
        slotPayload.uri = increment.uri;
        slotPayload.color = increment.color;

        chai
          .request(server)
          .post("/api/slots")
          .send(slotPayload)
          .end((err, res) => {
            res.body.elastic.created.should.be.true;
            res.should.have.status(200);
            done(err);
          });
      });
    });

    it(`slot is saved to elastic index ${ELASTIC_INDEX_NAME}`, done => {
      slotPayload.title = "Application " + slotCounter++;
      slotPayload.from = getDateTime.from();
      slotPayload.to = getDateTime.to();
      chai
        .request(server)
        .post("/api/slots")
        .send(slotPayload)
        .end((err, res) => {
          res.body.elastic._index.should.be.eql(ELASTIC_INDEX_NAME);
          done(err);
        });
    });

    describe("Validate input", () => {
      it("two same time-range response statusCode 500", done => {
        chai
          .request(server)
          .post("/api/slots")
          .send(clonedSlotPayload)
          .end((err, res) => {
            res.body.elastic.created.should.be.true;
            res.should.have.status(200);

            setTimeout(function() {
              chai
                .request(server)
                .post("/api/slots")
                .send(clonedSlotPayload)
                .end((err, res) => {
                  let errorMessage = JSON.parse(res.text);
                  errorMessage.message.should.be.eql(
                    "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"
                  );
                  res.should.have.status(500);
                  done();
                });
            }, 3000);
          });
      });
    });

    describe("json-payload is validated against json-schema", () => {
      it("label from is string", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.from = 0;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql(
            "Invalid type: number (expected string)"
          );
          res.body.dataPath.should.be.eql("/from");
          res.body.params.should.be.eql({ type: "number", expected: "string" });
          done();
        });
      });

      it("label from is required", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.from;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql("Missing required property: from");
          done();
        });
      });

      it("label to is string", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.to = 0;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql(
            "Invalid type: number (expected string)"
          );
          res.body.dataPath.should.be.eql("/to");
          res.body.params.should.be.eql({ type: "number", expected: "string" });
          done();
        });
      });

      it("label to is required", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.to;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql("Missing required property: to");
          done();
        });
      });

      it("label color is string", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.color = 0;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql(
            "Invalid type: number (expected string)"
          );
          res.body.dataPath.should.be.eql("/color");
          res.body.params.should.be.eql({ type: "number", expected: "string" });
          done();
        });
      });

      it("label color is required", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.color;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql("Missing required property: color");
          done();
        });
      });

      it("label title is string", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.title = 0;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql(
            "Invalid type: number (expected string)"
          );
          res.body.dataPath.should.be.eql("/title");
          res.body.params.should.be.eql({ type: "number", expected: "string" });
          done();
        });
      });

      it("label title is required", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.title;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql("Missing required property: title");
          done();
        });
      });

      it("label uri is string", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.uri = 0;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql(
            "Invalid type: number (expected string)"
          );
          res.body.dataPath.should.be.eql("/uri");
          res.body.params.should.be.eql({ type: "number", expected: "string" });
          done();
        });
      });

      it("label uri is required", done => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.uri;
        chai.request(server).post("/api/slots").send(_slot).end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.eql("Missing required property: uri");
          done();
        });
      });
    });
  });

  if (process.env.NODE_ENV !== "fillData") {
    describe("GET /api/slots", () => {
      it(`GET all slots`, done => {
        setTimeout(function() {
          chai.request(server).get("/api/slots").end((err, res) => {
            res.should.have.status(200);
            slot = res.body.elastic.responses[0].hits.hits[0];
            res.body.elastic.responses[0].hits.hits.length.should.be.above(0);
            done(err);
          });
        }, 1000);
      });

      it("GET slot by :slot_id", done => {
        chai.request(server).get("/api/slots/" + slot._id).end((err, res) => {
          res.should.have.status(200);
          res.body.elastic._id.should.be.eql(slot._id);
          done(err);
        });
      });

      it("slot is valid", done => {
        chai.request(server).get("/api/slots/" + slot._id).end((err, res) => {
          res.should.have.status(200);
          let valid = tv4.validateResult(res.body.elastic._source, schema);
          if (!valid.valid) return done(valid.error.message);
          done(err);
        });
      });
    });

    describe("DELETE /api/slots", () => {
      it("Delete slot by :slot_id", done => {
        chai
          .request(server)
          .delete("/api/slots/" + slot._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.elastic.found.should.be.eql(true);
            res.body.elastic.result.should.be.eql("deleted");
            done(err);
          });
      });

      it("Delete all slots from elasticsearch", done => {
        chai.request(server).delete("/api/slots/").end((err, res) => {
          res.should.have.status(200);
          res.body.elastic.should.be.eql({ acknowledged: true });
          done(err);
        });
      });
    });
  }
});
