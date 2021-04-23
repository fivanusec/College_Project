import React from "react";
import { Route, Switch } from "react-router-dom";
import AboutUs from "../pages/AboutUs";
import ChangePassword from "../pages/change-password/[token]";
import Contact from "../pages/Contact";
import Dashboard from "../pages/dashboard/[id]";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/aboutus">
        <AboutUs />
      </Route>
      <Route exact path="/contact">
        <Contact />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route exact path="/change-password/:token">
        <ChangePassword />
      </Route>
      <Route exact path="/dashboard/:id">
        <Dashboard />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
