// run by command yarn integration

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import moment from 'moment';
import tv4 from 'tv4';
import schema from '../app/schema';
let should = chai.should();
let slot = null;

const SLOT = {
  "from": moment().format('HH:mm:ss'),
  "to": moment().add(1, 'minutes').format('HH:mm:ss'),
  "color": "336699",
  "title": "Todo1",
  "type": "box",
  "uri": "http://",
  "duration": 0,
  "pause": false
};
const ELASTIC_INDEX_NAME = "monitor-slots";

chai.use(chaiHttp);

describe('Slots', () => {

  describe('POST /api/slots', () => {

    it('POST a slot', (done) => {
      chai.request(server)
        .post('/api/slots')
        .send(SLOT)
        .end((err, res) => {
          res.body.elastic.created.should.be.true;
          res.should.have.status(200);
          done(err);
        });
    });

    it(`slot is saved to elastic index ${ELASTIC_INDEX_NAME}`, (done) => {
      chai.request(server)
        .post('/api/slots')
        .send(SLOT)
        .end((err, res) => {
          res.body.elastic._index.should.be.eql(ELASTIC_INDEX_NAME);
          done(err);
        });
    });

    describe('json-payload is validated against json-schema', () => {

      it('label from is string', (done) => {
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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
        let _slot = JSON.parse(JSON.stringify(SLOT));
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

});