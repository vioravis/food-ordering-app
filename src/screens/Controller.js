import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "../screens/home/Home";
import Details from "./details/Details";
import Checkout from "./checkout/Checkout";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.baseUrl = "http://localhost:8080/api/";
  }

  render() {
    const hasLogin = sessionStorage.getItem("access-token") !== null;
    return (
      <Router>
        <div className="main-container">
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Home {...props} baseUrl={this.baseUrl} />}
            />
            <Route
              exact
              path="/restaurant/:id"
              render={props => <Details {...props} baseUrl={this.baseUrl} />}
            />
            <Route
              exact
              path="/checkout"
              render={props =>
                sessionStorage.getItem("access-token") !== null ? (
                  <Checkout {...props} baseUrl={this.baseUrl} />
                ) : (
                  <Redirect
                    to={{ pathname: "/", state: { from: props.location } }}
                  />
                )
              }
            />
            <Route
              exact
              path="/profile"
              render={props =>
                hasLogin ? (
                  <div>This is Profile page</div>
                ) : (
                  <Redirect
                    to={{ pathname: "/", state: { from: props.location } }}
                  />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Controller;
