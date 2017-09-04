import React from "react";
import { Router, Route, hashHistory, IndexRoute } from "react-router";
import {
  PresentationContainer,
  TimelineContainer,
  AboutContainer,
  SettingsContainer
} from "./containers";
import { Layout, PausePage } from "./components";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers";

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const store = createStore(reducers, applyMiddleware(...middleware));
//console.log(store.getState());

// Use hashHistory for easier development
const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/">
        <IndexRoute component={PresentationContainer} />
      </Route>
      <Route path="/admin" component={Layout}>
        <IndexRoute component={TimelineContainer} />
      </Route>
      <Route path="/pause-page" component={PausePage} />
      <Route path="/about" component={Layout}>
        <IndexRoute component={AboutContainer} />
      </Route>
      <Route path="/settings" component={Layout}>
        <IndexRoute component={SettingsContainer} />
      </Route>
    </Router>
  </Provider>
);

export default routes;
