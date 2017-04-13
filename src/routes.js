import React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {TimelineContainer} from './containers';
import {Layout} from './components';

// Use hashHistory for easier development
const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={TimelineContainer}/>
    </Route>
  </Router>
);

export default routes;
