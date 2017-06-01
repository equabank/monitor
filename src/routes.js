import React from "react";
import { Router, Route, hashHistory, IndexRoute } from "react-router";
import { PresentationContainer, TimelineContainer } from "./containers";
import { Layout, PausePage } from "./components";

// Use hashHistory for easier development
const routes = (
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={PresentationContainer} />
    </Route>
    <Route path="/admin" component={Layout}>
      <IndexRoute component={TimelineContainer} />
    </Route>
    <Route path="/pause-page" component={PausePage} />
  </Router>
);

export default routes;
