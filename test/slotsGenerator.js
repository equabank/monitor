// run by command yarn integration

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import moment from "moment";
import tv4 from "tv4";
import schema from "../app/slotSchema";
let should = chai.should();

import elasticsearch from "elasticsearch";
const elasticUri = process.env.ELASTIC_URI || "http://localhost:9200";

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
import { deleteAllSlots, getSlots } from "../app/slots";

const generatorPayload = JSON.stringify({
  duration: 360,
  timeSlots: [
    {
      duration: 30,
      title: "Application A",
      uri: "http://"
    },
    {
      duration: 30,
      title: "Application B",
      uri: "http://"
    }
  ]
});

const ELASTIC_INDEX_NAME = "monitor-slots";

chai.use(chaiHttp);
if (process.env.NODE_ENV !== "fillData") {
  describe("Slots generator", () => {
    describe("POST /api/slots/generator", () => {
      beforeEach(done => {
        getSlots(client, (error, slots) => {
          if (
            slots.responses[0].status < 400 &&
            slots.responses[0].hits.total > 0
          ) {
            deleteAllSlots(client, (error, response) => {
              done(error);
            });
          } else {
            done(error);
          }
        });
      });
      it(`should be create 12 background time slots`, done => {
        chai
          .request(server)
          .post("/api/slots/generator")
          .send(JSON.parse(generatorPayload))
          .end((err, res) => {
            res.body.timeSlots.length.should.be.eql(12);
            res.should.have.status(200);
            done(err);
          });
      });

      it(`each created time slot has elasticsearch created true`, done => {
        chai
          .request(server)
          .post("/api/slots/generator")
          .send(JSON.parse(generatorPayload))
          .end((err, res) => {
            res.body.timeSlots.forEach(timeSlot => {
              timeSlot.saved.created.should.be.eql(true);
            });
            res.should.have.status(200);
            done(err);
          });
      });

      it(`slots is saved to elastic index ${ELASTIC_INDEX_NAME}`, done => {
        chai
          .request(server)
          .post("/api/slots/generator")
          .send(JSON.parse(generatorPayload))
          .end((err, res) => {
            res.body.timeSlots.forEach(timeSlot => {
              timeSlot.saved._index.should.be.eql(ELASTIC_INDEX_NAME);
            });
            done(err);
          });
      });

      describe("GeneratorSlotSchema", () => {
        it(`total duration is required`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          delete _generatorPayload.duration;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Missing required property: duration"
              );
              done();
            });
        });

        it(`total duration is max 15000s`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.duration = 15001;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Value 15001 is greater than maximum 15000"
              );
              res.body.params.should.be.eql({ value: 15001, maximum: 15000 });
              done();
            });
        });

        it(`total duration is number`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.duration = "string is wrong";
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Invalid type: string (expected number)"
              );
              res.body.params.should.be.eql({
                type: "string",
                expected: "number"
              });
              done();
            });
        });

        it(`duration in each time slot is required`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          delete _generatorPayload.timeSlots[0].duration;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Missing required property: duration"
              );
              done();
            });
        });

        it(`min duration in each time slot is 30s`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.timeSlots[0].duration = 29;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Value 29 is less than minimum 30"
              );
              res.body.params.should.be.eql({ value: 29, minimum: 30 });
              done();
            });
        });

        it(`duration in each time slot is number`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.timeSlots[0].duration = "string is wrong";
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Invalid type: string (expected number)"
              );
              res.body.params.should.be.eql({
                type: "string",
                expected: "number"
              });
              done();
            });
        });

        it(`title in each time slot is required`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          delete _generatorPayload.timeSlots[0].title;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Missing required property: title"
              );
              done();
            });
        });

        it(`title in each time slot is string`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.timeSlots[0].title = 10;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Invalid type: number (expected string)"
              );
              done();
            });
        });

        it(`uri in each time slot is required`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          delete _generatorPayload.timeSlots[0].uri;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql("Missing required property: uri");
              done();
            });
        });

        it(`uri in each time slot is string`, done => {
          let _generatorPayload = JSON.parse(generatorPayload);
          _generatorPayload.timeSlots[0].uri = 10;
          chai
            .request(server)
            .post("/api/slots/generator")
            .send(_generatorPayload)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.message.should.be.eql(
                "Invalid type: number (expected string)"
              );
              done();
            });
        });
      });
    });
  });

  describe("DELETE /api/slots", () => {
    it("Delete all slots from elasticsearch", done => {
      chai.request(server).delete("/api/slots/").end((err, res) => {
        res.should.have.status(200);
        res.body.elastic.should.be.eql({ acknowledged: true });
        done(err);
      });
    });
  });
}
