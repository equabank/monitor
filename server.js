import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import elasticsearch from 'elasticsearch';
import {deleteOldBackgroundSlots, getSlots, getSlot, addSlot, deleteSlot, deleteAllSlots} from './app/slots';
import tv4 from 'tv4';
import schema from './app/schema';
import {timeRangeSlotValidate} from './src/components/timeline/libs/inputValidator';

const logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory,
  maxFiles: 10
})

const elasticUri = process.env.ELASTIC_URI || 'http://localhost:9200';

let client = new elasticsearch.Client({
  host: elasticUri,
  log: {
    type: 'file',
    level: ['error'],
    path: './logs/elasticsearch.log'
  },
  apiVersion: '5.0',
  requestTimeout: 1000,
  keepAlive: true,
  maxSockets: 10,
});

client.ping({
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('[Elasticsearch] cluster is down!');
  }
});

// Remove old background slots
setInterval( () => {
  deleteOldBackgroundSlots(client, (error, response) => {
    if (error) { console.log(error); }
  });
}, 60000);

const app = express();
const port = process.env.PORT || 3001;

// Body parser and Morgan middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({ type: 'application/json'}));

if(process.env.NODE_ENV !== 'test' || process.env.NODE_ENV !== 'fillData') {
  app.use(morgan('dev', {stream: accessLogStream}));
}

// We tell express where to find static assets
app.use(express.static(__dirname + '/client/dist'));

// Enable CORS so that we can make HTTP request from webpack-dev-server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'Api is live!' });
});

router.route('/slots')
  .post((req, res) => {

    let valid = tv4.validateResult(req.body,schema);

    if (!valid.valid) return res.status(500).send({
        message: valid.error.message,
        dataPath: valid.error.dataPath,
        params: valid.error.params
    });

    getSlots(client, (error, elastic) => {
      if (error) {
        return res.status(500).end(JSON.stringify(error));
      }

      // if exists any timeslot
      if (elastic.responses[0].hits !== undefined && elastic.responses[0].hits.hits.length !== 0) {
        timeRangeSlotValidate(elastic.responses[0].hits.hits, req.body.from, req.body.to, req.body.type)
        .then(() => {
          addSlot(client, req.body, (error, response) => {
            if (error) {
              return res.status(500).end(JSON.stringify(error));
            }
            res.json({
              elastic: response
            })
          })
        }).catch( err => {
          return res.status(500).end(JSON.stringify(err));
        });

      // if don't exist timeslot
      } else {
        addSlot(client, req.body, (error, response) => {
          if (error) {
            return res.status(500).end(JSON.stringify(error));
          }
          res.json({
            elastic: response
          })
        })
      }
    })
  })

  .get((req, res) => {
    getSlots(client, (error, response) => {
      if (error) {
        return res.status(500).end(JSON.stringify(error));
      }
      res.json({
        elastic: response
      })
    })
  })

  .delete((req, res) => {
    deleteAllSlots(client, (error, response) => {
      if (error) {
        return res.status(500).end(JSON.stringify(error));
      }
      res.json({
        elastic: response
      })
    })
  })

router.route('/slots/:slot_id')

  .get((req, res) => {
    getSlot(client, req.params.slot_id, (error, response) => {
      if (error) {
        return res.status(500).end(JSON.stringify(error));
      }
      res.json({
        elastic: response
      })
    })
  })

  .delete((req, res) => {
    deleteSlot(client, req.params.slot_id, (error, response) => {
      if (error) {
        return res.status(500).end(JSON.stringify(error));
      }
      res.json({
        elastic: response
      });
    });
  });

app.use('/api', router);

app.route("*").get((req, res) => {
  res.sendFile('client/dist/index.html', { root: __dirname });
});

app.listen(port);

console.log(`listening on port ${port}`);

module.exports = app;
