import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

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
        <h2>No match found for <code>{location.hash}</code></h2>
        <p>{info}</p>
      </header>
    </div>
);

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/example" component={Example} />

        {/* when none of the above match, <BadRoute> will be rendered */}
        <Route render={props => <Page404 {...props} info="INSERT COIN..." />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
