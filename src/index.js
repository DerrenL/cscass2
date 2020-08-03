import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import "assets/scss/material-kit-react.scss?v=1.9.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/SignupPage/SignupPage.js";
import UploadImagePage from "views/UploadImage/UploadImage.js";
import AfterLoginComponents from "views/Components/AfterLogin.js";
import SubscribePage from "views/SubscribePage/SubscribePage.js";
import EditTalentPage from "views/Components/EditBasics.js";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/signup-page" component={SignupPage} />
      <Route path="/subscribe-page" component={SubscribePage} />
      <Route path="/uploadimage-page" component={UploadImagePage} />
      <Route path="/afterlogin-page" component={AfterLoginComponents} />
      <Route path="/edittalent-page" component={EditTalentPage} />
      <Route path="/" component={Components} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
serviceWorker.unregister();
