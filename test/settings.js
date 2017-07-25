// run by command yarn integration

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
let should = chai.should();
let lastStateGeneratorSlotValidatorAllow = false;

chai.use(chaiHttp);

describe("Settings", () => {
  describe("GET /api/settings", () => {
    it("generatorSlotValidatorAllow exist", done => {
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
          lastStateGeneratorSlotValidatorAllow =
            configValue.generatorSlotValidatorAllow;
          done();
        } else {
          done(err);
        }
      });
    });

    it("generatorSlotValidatorAllow change state", done => {
      chai
        .request(server)
        .put("/api/settings")
        .send({
          generatorSlotValidatorAllow: lastStateGeneratorSlotValidatorAllow
            ? false
            : true
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
});
