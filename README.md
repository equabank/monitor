# MONITOR 0.1.2

Dockerized application for planned of switching between another diagnostic web applications.


## Sending Feedback
[Issue tracker, questions or ideas.](https://github.com/test-stack/monitor/issues)

## Table of Contents

- [What's Inside](#whats-inside)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Tests](#tests)
- [Elasticsearch](#elasticsearch)
- [How To Use](#how-to-use)
  - [CLI](#cli)
  - [Docker](#docker)
  - [Kubernetes](#kubernetes)
- [Api](#api)

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

This application is [dockerized](https://hub.docker.com/r/rdpanek/monitor/) and was created [Kubernetes](https://kubernetes.io/) [recipe](https://github.com/test-stack/monitor/blob/master/kubernetes.yaml)

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
- `yarn server` run backend part application
- `yarn unit` run unit tests and watcher ( for development )
- `yarn filldata` remove old slots from elasticsearch and create a new slots by counter. This is extended integration tests.
- `yarn integration` run integration tests
- `yarn start` run application for production environment

## Tests

This project contains many tests, eg. unit tests, e2e and integration tests

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

## How To Use

### CLI

For development:

  1. `yarn server` - backend part
  2. `yarn client` - backend client
  
  
For production use:

- `yarn start`

### Docker

Re-build Docker image:
- docker build rdpanek/monitor:tag .

\- or -

- use auto-build image from [Docker Hub](https://hub.docker.com/r/rdpanek/monitor/)


and

run image: `docker run --name monitor ELASTIC_URI=xxx.xxx.xxx.xxx:9200 rdpanek/monitor:latest`

### Kubernetes

`kubectl create -f kubernetes.yaml`

and check log

`kubectl logs -f pod`