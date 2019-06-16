import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import logo from './logo.svg';
import './App.css';
import Login from './Login';

function Example() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const Page404 = ({location, info}) => (
  <div className="App">
    <header className="App-header">
      <Alert variant='dark'>
        <Alert.Heading>No match found for <code>{location.pathname}</code></Alert.Heading>
        <hr />
        <p>{info}</p>
      </Alert>
    </header>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/example" component={Example} />
        <Route exact path="/login" component={Login} />
        {/* when none of the above match, <BadRoute> will be rendered */}
        <Route render={props => <Page404 {...props} info="INSERT COIN..." />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
