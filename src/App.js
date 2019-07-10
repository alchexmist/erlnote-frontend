/* eslint-disable max-len */
import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';
import Login from './Login';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

// eslint-disable-next-line no-unused-vars
const Page404 = ({location, info}) => (
  <Container className="d-flex flex-column justify-content-center App-header h-100" fluid="true">
    <Row>
      <Col className="d-flex flex-row justify-content-center">
        <Alert variant='dark'>
          <Alert.Heading>No match found for <code>{location.pathname}</code></Alert.Heading>
          <hr />
          <p>{info}</p>
        </Alert>
      </Col>
    </Row>
  </Container>
);

Page404.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  info: PropTypes.string.isRequired,
};

// eslint-disable-next-line require-jsdoc
function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Switch>
        <Route exact path="/login" component={Login} />
        {/* when none of the above match, <BadRoute> will be rendered */}
        <Route render={(props) => <Page404 {...props} info="INSERT COIN..." />} />
      </Switch>
      <AppFooter />
    </BrowserRouter>
  );
}

export default App;
