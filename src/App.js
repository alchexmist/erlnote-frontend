/* eslint-disable max-len */
import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';
import Login from './Login';
import RunLogin from './containers/RunLogin';
import AppFooter from './components/AppFooter';
import SignUp from './components/SignUp';
import LoadMainContainer from './containers/LoadMainContainer';
import AppHeaderContainer from './containers/AppHeaderContainer';
import LoadEditBoard from './containers/LoadEditBoard';
import {ACCESS_TOKEN_PARAM} from './graphql-client';
import {withRouter} from 'react-router-dom';
import LoadEditTasklist from './containers/LoadEditTasklist';
import LoadEditNote from './containers/LoadEditNote';
// import EditBoard from './components/EditBoard';

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

// const SignUp = () => <h3>SignUp</h3>
const Protected = (props) => <h3>{props.extra}</h3>

// eslint-disable-next-line require-jsdoc
function App() {
  const existToken = () => (localStorage.getItem(ACCESS_TOKEN_PARAM));
  return (
    <BrowserRouter>
      <AppHeaderContainer />
      <Switch>
        {/* <Route exact path="/login" component={Login} /> */}
        {/* <Route path="/" exact component={RunLogin} /> */}
        {/* <Route path="/dashboard" exact component={MainContainer} /> */}
        {/* <Route path="/edit/board/:id" exact component={LoadEditBoard} /> */}
        {/* <Route path="/protected" exact render={(props) => <Protected {...props} extra={'Protegido'} />} /> */}
        <Route exact path="/" render={() => (existToken() ? (<Redirect push to="/dashboard"/>) : (<RunLogin />))}/>
        <Route exact path="/dashboard" render={() => (existToken() ? (<LoadMainContainer />) : (<RunLogin />))}/>
        <Route exact path="/edit/board/:id" render={() => (existToken() ? (<LoadEditBoard />) : (<RunLogin />))}/>
        <Route exact path="/edit/tasklist/:id" render={() => (existToken() ? (<LoadEditTasklist />) : (<RunLogin />))}/>
        <Route exact path="/edit/note/:id" render={() => (existToken() ? (<LoadEditNote />) : (<RunLogin />))}/>
        <Route exact path="/signup" component={SignUp} />
        {/* when none of the above match, <BadRoute> will be rendered */}
        <Route render={(props) => <Page404 {...props} info="INSERT COIN..." />} />
      </Switch>
      <AppFooter />
    </BrowserRouter>
  );
}

export default App;
