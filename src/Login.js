/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import {Button, Form, Nav, Navbar, ButtonToolbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import {ACCESS_TOKEN_PARAM} from './graphql-client';

import {Alert} from 'react-bootstrap';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          username
        }
        token
      }
    }`;

function LoginFailed(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return (<Alert variant="danger">
      ¡Fallo de autenticación!
    </Alert>
    );
  }
  return null;
}

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loginFailed: false,
      redirectToDashboard: false,
    };
  }

  render() {
    const {redirectToDashboard} = this.state;

    if (redirectToDashboard === true) {
      return <Redirect to='/dashboard' />;
    }

    const style = {loginLabel: {'color': 'white', 'backgroundColor': 'rgb(53, 58, 63)'}};
    return (
      // <Container className="d-flex flex-column justify-content-between h-100" fluid="true">
      <Container className="d-flex flex-column justify-content-between p-0" fluid="true">
        <Row>
          <Col className="d-flex flex-row justify-content-center">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={style.loginLabel}>Correo electrónico</Form.Label>
                <Form.Control size="lg" type="email" placeholder="Introduzca su dirección de correo" autoComplete="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
                <Form.Text className="text-muted">
                  Nunca compartiremos tu dirección de correo electrónico con nadie.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" >
                <Form.Label style={style.loginLabel}>Contraseña</Form.Label>
                <Form.Control size="lg" type="password" placeholder="Contraseña" autoComplete="current-password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
                <LoginFailed isLoggedIn={this.state.loginFailed} />
              </Form.Group>
              {/* <Container className="d-flex flex-row justify-content-end" fluid="true">
                <Row>
                <Col  > */}
              <Mutation
                mutation={LOGIN_MUTATION}
                onCompleted={({login}) => {
                  console.log('Token: ', login.token);
                  console.log('Username: ', login.user.username);
                  console.log('ID: ', login.user.id);
                  this.props.onLoginClick(login.user.id, login.user.username, login.token);
                  localStorage.setItem(ACCESS_TOKEN_PARAM, login.token);
                  console.log('MY TOKEN: ', localStorage.getItem(ACCESS_TOKEN_PARAM));
                  this.setState({redirectToDashboard: true});
                  // client.writeData({ data: { isLoggedIn: true } });
                }}
                onError={({error}) => {
                  this.props.onLoginClick(null, null, null);
                  console.log('Error de autenticación!');
                  this.setState({loginFailed: true});
                }}
              >
                {(loginMutation, {data}) => (
                  <Button block variant="dark" size="lg" type="submit" onClick={(e) => {
                    e.preventDefault();
                    loginMutation({variables: {email: this.state.email, password: this.state.password}});
                    this.setState({email: ''});
                    this.setState({password: ''});
                  }}>
                    Entrar
                  </Button>
                )}
              </Mutation>
              <Button block variant="dark" size="lg" type="reset">
                Restablecer
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    ); // End return-render
  }
}
