// run by command yarn integration

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import Moment from "moment";
let should = chai.should();
let generatorSlotValidatorAllow = false;

// Every put to elastic must be a new, for elastic response "successful": 1
let message = "Integration test message, unique number: " + Date.now();
let color = "Warning";
let endTime = Moment().add(120, "seconds").format("YYYY-MM-DDTHH:mm:ss");

chai.use(chaiHttp);

// Elasticsearch by default refreshes each shard every 1s,
// so the document will be available to search 1s after indexing it.
// https://github.com/elastic/elasticsearch-js/issues/231
function sleep(milliseconds) {
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

describe("Settings", () => {
  describe("PUT /api/settings", () => {
    it("change state", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: generatorSlotValidatorAllow,
          message: message,
          color: color,
          endTime: endTime
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          res.should.have.status(200);
          res.body.elastic._shards.should.be.eql({
            total: 2,
            successful: 1,
            failed: 0
          });
          done();
        });
    });

    it("property generatorSlotValidatorAllow is required", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          message: message,
          color: color,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Missing required property: generatorSlotValidatorAllow",
            dataPath: "",
            params: { key: "generatorSlotValidatorAllow" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property message is required", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          color: color,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Missing required property: message",
            dataPath: "",
            params: { key: "message" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property color is required", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: message,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Missing required property: color",
            dataPath: "",
            params: { key: "color" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property endTime is required", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: message,
          color: color
        })
        .end((err, res) => {
          const errMessage = {
            message: "Missing required property: endTime",
            dataPath: "",
            params: { key: "endTime" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property generatorSlotValidatorAllow is boolean", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: "true",
          message: message,
          color: color,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Invalid type: string (expected boolean)",
            dataPath: "/generatorSlotValidatorAllow",
            params: { type: "string", expected: "boolean" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property message is string", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: true,
          color: color,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Invalid type: boolean (expected string)",
            dataPath: "/message",
            params: { type: "boolean", expected: "string" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property color is string", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: message,
          color: 12,
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: "Invalid type: number (expected string)",
            dataPath: "/color",
            params: { type: "number", expected: "string" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property endTime is string", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: message,
          color: color,
          endTime: 12
        })
        .end((err, res) => {
          const errMessage = {
            message: "Invalid type: number (expected string)",
            dataPath: "/endTime",
            params: { type: "number", expected: "string" }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });

    it("property color can conntains value Warning, Notice or Success", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: true,
          message: message,
          color: "Info",
          endTime: endTime
        })
        .end((err, res) => {
          const errMessage = {
            message: 'No enum match for: "Info"',
            dataPath: "/color",
            params: { value: '"Info"' }
          };
          err.response.error.should.have.status(400);
          chai
            .expect(JSON.parse(err.response.error.text))
            .to.have.eql(errMessage);
          done();
        });
    });
  });

  describe("GET /api/settings", () => {
    it("verify that the values are stored correctly", done => {
      chai.request(server).get("/api/settings").end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);

        if (res.body.elastic.responses[0].status !== 404) {
          let configValue = res.body.elastic.responses[0].hits.hits[0]._source;
          chai
            .expect(configValue)
            .to.have.property("generatorSlotValidatorAllow");
          chai.expect(configValue).to.have.property("message");
          chai.expect(configValue).to.have.property("color");
          chai.expect(configValue).to.have.property("endTime");
          done();
        } else {
          done(err);
        }
      });
    });

    it("property generatorSlotValidatorAllow is false", done => {
      sleep(2000);
      chai.request(server).get("/api/settings").end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);

        if (res.body.elastic.responses[0].status !== 404) {
          let configValue = res.body.elastic.responses[0].hits.hits[0]._source;
          chai.expect(configValue.generatorSlotValidatorAllow).to.be.false;
          done();
        } else {
          done(err);
        }
      });
    });

    it("property message contains text: " + message, done => {
      chai.request(server).get("/api/settings").end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);

        if (res.body.elastic.responses[0].status !== 404) {
          let configValue = res.body.elastic.responses[0].hits.hits[0]._source;
          chai.expect(configValue.message).to.be.eql(message);
          done();
        } else {
          done(err);
        }
      });
    });

    it("property endTime contains: " + endTime, done => {
      chai.request(server).get("/api/settings").end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);

        if (res.body.elastic.responses[0].status !== 404) {
          let configValue = res.body.elastic.responses[0].hits.hits[0]._source;
          chai.expect(configValue.endTime).to.be.eql(endTime);
          done();
        } else {
          done(err);
        }
      });
    });
  });
});
