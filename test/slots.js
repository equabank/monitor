// run by command yarn integration

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import moment from 'moment';
import tv4 from 'tv4';
import schema from '../app/schema';
let should = chai.should();
let slot = null;
let slotCounter = 1;
let lastMinutes = 0;
const startDateTime = moment().hours(6).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss")

let getDateTime = {
    from: () => {
      return moment(startDateTime).add(lastMinutes, 'minutes').format('HH:mm:ss');
    },
    to: () => {
      lastMinutes = 10 + lastMinutes;
      return moment(startDateTime).add(lastMinutes, 'minutes').format('HH:mm:ss');
    }
  }

let slotPayload = {
  "from": "06:11:00",
  "to": "06:20:00",
  "color": "default",
  "title": "Application ",
  "type": "range",
  "uri": "http://",
  "duration": 0,
  "pause": false
};
const ELASTIC_INDEX_NAME = "monitor-slots";

chai.use(chaiHttp);

describe('Slots', () => {

  describe('POST /api/slots', () => {

    let dataProvider = [
      {order: 1, type: "range"},
      {order: 2, type: "range"},
      {order: 3, type: "range"},
      {order: 4, type: "range"},
      {order: 5, type: "background"},
      {order: 6, type: "range"},
      {order: 7, type: "background"},
      {order: 8, type: "range"},
      {order: 9, type: "range"},
      {order: 10, type: "range"},
      {order: 11, type: "background"},
      {order: 12, type: "range"},
      {order: 13, type: "range"},
      {order: 14, type: "range"},
      {order: 15, type: "range"},
      {order: 16, type: "background"},
      {order: 17, type: "range"},
      {order: 18, type: "background"},
      {order: 19, type: "range"},
      {order: 20, type: "range"},
      {order: 21, type: "range"},
      {order: 22, type: "background"},
      {order: 23, type: "range"},
      {order: 24, type: "range"},
      {order: 25, type: "range"},
      {order: 26, type: "range"},
      {order: 27, type: "background"},
      {order: 28, type: "range"},
      {order: 29, type: "background"},
      {order: 30, type: "range"},
      {order: 31, type: "range"},
      {order: 32, type: "range"},
      {order: 33, type: "background"},
      {order: 34, type: "range"},
      {order: 35, type: "range"},
      {order: 36, type: "range"},
      {order: 37, type: "range"},
      {order: 38, type: "background"},
      {order: 39, type: "range"},
      {order: 40, type: "background"},
      {order: 41, type: "range"},
      {order: 42, type: "range"},
      {order: 43, type: "range"},
      {order: 44, type: "background"},
    ];

    dataProvider.forEach( (increment) => {
      it(`POST a slot ${increment.order} and type ${increment.type}`, (done) => {

        slotPayload.title = "Application " + slotCounter++;
        slotPayload.from = getDateTime.from();
        slotPayload.to = getDateTime.to();
        slotPayload.type = increment.type;
        slotPayload.color = ( increment.type == "range" ? 'default' : 'background');
        chai.request(server)
          .post('/api/slots')
          .send(slotPayload)
          .end((err, res) => {
            res.body.elastic.created.should.be.true;
            res.should.have.status(200);
            done(err);
          });
      });
    });

    it(`slot is saved to elastic index ${ELASTIC_INDEX_NAME}`, (done) => {
      slotPayload.title = "Application " + slotCounter++;
      slotPayload.from = getDateTime.from();
      slotPayload.to = getDateTime.to();
      chai.request(server)
        .post('/api/slots')
        .send(slotPayload)
        .end((err, res) => {
          res.body.elastic._index.should.be.eql(ELASTIC_INDEX_NAME);
          done(err);
        });
    });

    describe('json-payload is validated against json-schema', () => {

      it('label from is string', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.from = 0
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: number (expected string)');
            res.body.dataPath.should.be.eql('/from');
            res.body.params.should.be.eql({type: 'number', expected: 'string'});
            done();
          });
      });

      it('label from is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.from
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: from');
            done();
          });
      });

      it('label to is string', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.to = 0
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: number (expected string)');
            res.body.dataPath.should.be.eql('/to');
            res.body.params.should.be.eql({type: 'number', expected: 'string'});
            done();
          });
      });

      it('label to is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.to
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: to');
            done();
          });
      });

      it('label color is string', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.color = 0
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: number (expected string)');
            res.body.dataPath.should.be.eql('/color');
            res.body.params.should.be.eql({type: 'number', expected: 'string'});
            done();
          });
      });

      it('label color is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.color
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: color');
            done();
          });
      });

      it('label title is string', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.title = 0
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: number (expected string)');
            res.body.dataPath.should.be.eql('/title');
            res.body.params.should.be.eql({type: 'number', expected: 'string'});
            done();
          });
      });

      it('label title is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.title
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: title');
            done();
          });
      });

      it('label uri is string', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.uri = 0
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: number (expected string)');
            res.body.dataPath.should.be.eql('/uri');
            res.body.params.should.be.eql({type: 'number', expected: 'string'});
            done();
          });
      });

      it('label uri is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.uri
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: uri');
            done();
          });
      });

      it('label duration is integer', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.duration = "0"
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: string (expected integer)');
            res.body.dataPath.should.be.eql('/duration');
            res.body.params.should.be.eql({type: 'string', expected: 'integer'});
            done();
          });
      });

      it('label duration is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.duration
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: duration');
            done();
          });
      });

      it('label pause is boolean', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        _slot.pause = "0"
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Invalid type: string (expected boolean)');
            res.body.dataPath.should.be.eql('/pause');
            res.body.params.should.be.eql({type: 'string', expected: 'boolean'});
            done();
          });
      });

      it('label pause is required', (done) => {
        slotPayload.title = "Application " + slotCounter++;
        let _slot = JSON.parse(JSON.stringify(slotPayload));
        delete _slot.pause
        chai.request(server)
          .post('/api/slots')
          .send(_slot)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.eql('Missing required property: pause');
            done();
          });
      });

    });
  });

  if ( process.env.NODE_ENV !== 'fillData' ) {

    describe('GET /api/slots', () => {

      it(`GET all slots`, (done) => {
        setTimeout(function () {
          chai.request(server)
            .get('/api/slots')
            .end((err, res) => {
              res.should.have.status(200);
              slot = res.body.elastic.responses[0].hits.hits[0];
              res.body.elastic.responses[0].hits.hits.length.should.be.above(0);
              done(err);
            });
        }, 1000);
      });

      it('GET slot by :slot_id', (done) => {
        chai.request(server)
          .get('/api/slots/' + slot._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.elastic._id.should.be.eql(slot._id);
            done(err);
          });
      });

      it('slot is valid', (done) => {
        chai.request(server)
          .get('/api/slots/' + slot._id)
          .end((err, res) => {
            res.should.have.status(200);
            let valid = tv4.validateResult(res.body.elastic._source, schema);
            if (!valid.valid) return done(valid.error.message);
            done(err);
          });
      });

    });

    describe('DELETE /api/slots', () => {

      it('Delete slot by :slot_id', (done) => {
        chai.request(server)
          .delete('/api/slots/' + slot._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.elastic.found.should.be.eql(true);
            res.body.elastic.result.should.be.eql('deleted');
            done(err);
          });
      });

      it('Delete all slots from elasticsearch', (done) => {
        chai.request(server)
          .delete('/api/slots/')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.elastic.should.be.eql({"acknowledged": true});
            done(err);
          });
      });


    });
  }

});