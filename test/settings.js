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
      sleep(1000);
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
