import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import NavBar from './Components/NavBar';
import ErrorMessage from './Components/ErrorMessage';
import Home from './Components/Home';
import Points from './Components/Points';
import Teams from './Components/Teams';

import 'bootstrap/dist/css/bootstrap.css';

import config from './Config';
import { UserAgentApplication } from 'msal';
import { getUserDetails } from './GraphService';

class App extends Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    });

    var user = this.userAgentApplication.getAccount();

    this.state = {
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      this.getUserProfile();
    }
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account"
        });
      await this.getUserProfile();
    }
    catch (err) {
      var error = {};

      if (typeof (err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }

  logout() {
    this.userAgentApplication.logout();
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        this.setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName
          },
          error: null
        });
      }
    }
    catch (err) {
      var error = {};
      if (typeof (err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = <ErrorMessage message={this.state.error.message} debug={this.state.error.debug} />;
    }

    return (
      <div>
        <Router>
          <div>
            <NavBar
              isAuthenticated={this.state.isAuthenticated}
              authButtonMethod={this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
              user={this.state.user} />
          </div>
          <Container>
            {error}
            <Route exact path="/"
              render={(props) =>
                <Home {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  authButtonMethod={this.login.bind(this)} />
              } />
            <Route exact path="/points"
              render={(props) =>
                <Points {...props}
                  showError={this.setErrorMessage.bind(this)} />
              } />
            <Route exact path="/teams"
              render={(props) =>
                <Teams {...props}
                  showError={this.setErrorMessage.bind(this)} />
              } />
          </Container>
        </Router>
      </div>
    );
  }

  setErrorMessage(message, debug) {
    this.setState({
      error: { message: message, debug: debug }
    });
  }
}

export default App;