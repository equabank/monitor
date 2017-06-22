# MONITOR 0.2.1 [![Build Status](https://travis-ci.org/test-stack/monitor.svg?branch=develop)](https://travis-ci.org/test-stack/monitor)

Dockerized application for planned of switching between another diagnostic web applications.


## Sending Feedback
Milestones, Issue, Pull Requests, IDEAS / Backlog
[Issue tracker, questions or ideas.](https://github.com/test-stack/monitor/issues)

## Table of Contents

- [What's Inside](#whats-inside)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Tests](#tests)
- [Elasticsearch](#elasticsearch)
- [How To Run](#how-to-run)
  - [CLI](#cli)
  - [Docker](#docker)
  - [Kubernetes](#kubernetes)
- [How To Use](#how-to-use)
  - [Browser](#browser)
  - [Api](#api)
- [Elasticsearch](#elasticsearch)

## What’s Inside?
Currently this application contains many amazing community projects, such as:

- [Webpack](https://webpack.github.io/)module bundler with webpack-dev-server, html-webpack-plugin and style-loader
- [Babel](https://babeljs.io)with ES6 and extensions used by Facebook (JSX, object spread, class properties)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [ESLint](http://eslint.org/)
- [Jest](https://facebook.github.io/jest/)
- [React](https://facebook.github.io/react/)
- [NodeJS](https://nodejs.org/en/)
- [create-react-app](https://github.com/facebookincubator/create-react-app)

This application is [dockerized](https://hub.docker.com/r/rdpanek/monitor/) and here is [Kubernetes](https://kubernetes.io/) [recipe](https://github.com/test-stack/monitor/blob/master/kubernetes.yaml)

## Folder Structure

After clone this repository, you see:

```
monitor/
  README.md
  .babelrc - config for babeljs
  .dockerignore - exclude directory when creating docker image
  .gitignore
  Dockerfile - recipe for create dockerized application
  kubernetes.yaml - recipe for run dockerized application in Kubernetes environment
  package.json - recipe for CLI instalation
  server.json - backend layer
  app/ - tv4 validator and query for elasticsearch
  build/ - production build
  e2eTests/ - support only Harness test stack via Selenium
  public/ - static files
  src/ - frontend application
  tests/ - integration tests and random data filler for manual testing
```

After run application, your see additional files and directories.

## Available Scripts

In nodeJS / Yarn environment:

- `yarn client` run frontend part application
- `ELASTIC_URI=http://IP:9200 yarn server` run backend part application
- `TZ=Pacific/Bougainville` default: Europe/Prague
- `yarn unit` run unit tests and watcher ( for development )
- `yarn filldata` remove old slots from elasticsearch and create a new slots by counter. This is extended integration tests.
- `yarn integration` run integration tests
- `yarn start` run application for production environment

## Tests

This project contains many tests, e.g. unit tests, e2e and integration tests

### Unit tests
run via `yarn unit`

```
monitor/
  src/
    components/
      *.test.jsx
```

### E2E Tests

run via [Harness](https://github.com/test-stack/harness) e2e test-stack environment

1. docker run -it --name harness -v `PWD`/e2eTests/:/home/harness rdpanek/docker_harness:1.6
2. continue in [Harness](https://github.com/test-stack/harness) documentation

### Integration Tests

Integration tests for endpoint API `/api/slots`.

Run via `yarn integration`

```
monitor/
  tests/
    slots.js
```

## How To Run

### CLI

For development:

  1. `ELASTIC_URI=http://IP:9200 yarn server` - backend part
  2. `yarn client` - backend client


For production use:

- `yarn start`

### Docker

Re-build Docker image:
- docker build rdpanek/monitor:tag .

\- or -

- you can use auto-build image from [Docker Hub](https://hub.docker.com/r/rdpanek/monitor/)


then run

run image: `docker run --name monitor -d -e TZ=Europe/Prague -e ELASTIC_URI=xxx.xxx.xxx.xxx:9200 -p 3000:3000 -p 3001:3001 rdpanek/monitor:0.2.1`

### Kubernetes
Fill `ELASTIC_URI` and run

`kubectl create -f kubernetes.yaml`

and check log

`kubectl logs -f pod`


## How To Use

This application has a WEB and REST-API interface. When is application run, then schedulled presentations is available on default URI `IP:PORT`. Administration interface is available on uri `IP:PORT/#/admin`


### Browser

Browser interface allows to displayed schedulled presentations or Administration interface.

Administration interface contains Timeline, which show schedulled presentations, so called Time Slots added via form CREATE SLOT and Background Time Slots added via REST-API.

If exist Time Slot and Background Time Slot in the same time, then Background Time Slot has higher priority, so in Presentation view will be show the Background Time Slot.

Click on CREATE SLOT button show intuitive dialogue for create Time Slot. To field `URI` must contain URI web application. Beware of `X-FRAME-OPTIONS` in headers. Fields from and to must be unique for Time Slot and Banckground Time Slots. Colors is useful for identification more Time Slots on Timeline. Background Time Slots has predefined color.

### API

#### Create Single Time Slot

REST-API is useful for sending command for show presentation from other tools., e.g. Show Kibana Dashboard with latests results of performance tests from now to 10min laters.

You can use REST-API endpoint `IP:3001/api/slots` and send this payload

```
{
    "from": "09:58:30",
    "to": "09:58:40",
    "color": "background",
    "title": "Performance tests analysis summary | Smoke",
    "type": "background",
    "uri": "http://my-kibana.xyz:31159/goto/254cb2303c9dca4d3786eaa9bc8ae5e1"
}
```
The form of this payload must remain unchanged. You can change only:

- `from` format: HH:mm:ss
- `to` format: HH:mm:ss
- `title` is useful for Presentation layer, when a banner is displayed with the name of the application to be displayed. Title is used in Timeline for name of Time Slots and Background Time Slots
- `uri` Beware of `X-FRAME-OPTIONS` in headers.

The Background Time Slots has higgher priority than Time Slots. When is time to show Background Time Slot, is shown instead Time Slots.

Response must contain property `created` with value `true`


#### Create a Time Slots in bulk via generator endpoint

Api contains endpoint `POST /api/slots/generator` for create lot of more Time Slots via generator definition in JSON format.

You can use REST-API endpoint `IP:3001/api/slots/generator` and send this payload

**Request**
```
{
  "duration": 360,
  "timeSlots": [{
    "duration": 60,
    "title": "Application A",
    "uri": "http://"
  },{
    "delay": 120,
    "duration": 60,
    "title": "Application B",
    "uri": "http://"
  }]
}
```

The form of this payload must remain unchanged. You can change only:

- `duration` in seconds - is time range ( from now to +duration ) for all new time slots
- `timeSlots.delay` in seconds - is optional and shifts the start time ( now + delay )
- `timeSlots.duration` in seconds - is time range ( from now to +duration ) for this time slot
- `timeSlots.title` is useful for Presentation layer, when a banner is displayed with the name of the application to be displayed. Title is used in Timeline for name of Time Slots and Background Time Slots
- `uri` Beware of `X-FRAME-OPTIONS` in headers.

**Response**
```
{
    "timeSlots": [
        {
            "timeSlot": {
                "duration": 60,
                "title": "Application A",
                "uri": "http://",
                "from": "14:01:35",
                "to": "14:02:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695687",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        },
        {
            "timeSlot": {
                "delay": 120,
                "duration": 60,
                "title": "Application B",
                "uri": "http://",
                "from": "14:02:35",
                "to": "14:03:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695688",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        },
        {
            "timeSlot": {
                "duration": 60,
                "title": "Application A",
                "uri": "http://",
                "from": "14:03:35",
                "to": "14:04:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695689",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        },
        {
            "timeSlot": {
                "delay": 120,
                "duration": 60,
                "title": "Application B",
                "uri": "http://",
                "from": "14:04:35",
                "to": "14:05:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695690",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        },
        {
            "timeSlot": {
                "duration": 60,
                "title": "Application A",
                "uri": "http://",
                "from": "14:05:35",
                "to": "14:06:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695691",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        },
        {
            "timeSlot": {
                "delay": 120,
                "duration": 60,
                "title": "Application B",
                "uri": "http://",
                "from": "14:06:35",
                "to": "14:07:35",
                "timeRangeSlotValidator": true
            },
            "saved": {
                "_index": "monitor-slots",
                "_type": "monitor-slots",
                "_id": "1497873695692",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            }
        }
    ],
    "endTime": "14:07:35",
    "processingTime": {
        "ms": 566
    }
}
```

The reply contains the generator job report. Each time slot is completed in generator about some next labels:

- `timeSlots.timeSlot.from` - from is `now` or value from label `to` from last time slot in one generator definition
- `timeSlots.timeSlot.to` - is `(now + timeSlots.duration)` and this value is use in `from` in next time slot
- `timeSlots.timeSlot.timeRangeSlotValidator` - each a new time slot with new time range `from` and `to` is passed through the time range validator. Result is `true` or `false` and completed in next label `message` with description of reason `{"freeSlotAvailable": false,"message": "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"}`
- `timeSlots.saved.created` is `true` if is save time slot is successful. If `timeSlots.timeSlot.timeRangeSlotValidator` is `false`, then `timeSlots.save` is also `false`

The Time Slot Generator generate only Background Time Slots.

## Elasticsearch

Time Slots and Background Time Slots is stored in elasticsearch  in `monitor-slots` index. If not exist, it will be automatically created.
