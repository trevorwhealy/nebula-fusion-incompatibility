// @flow
import React from "react";
import { Route, Switch } from "fusion-plugin-react-router";

// import Home from './pages/home.js';
import PageNotFound from "./pages/pageNotFound.js";
import Demo from "./pages/demo.js";

const root = (
  <Switch>
    <Route exact path="/" component={Demo} />
    <Route component={PageNotFound} />
  </Switch>
);

export default root;
