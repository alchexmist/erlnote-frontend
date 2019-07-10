/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Button, Form, Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        token
      }
    }`;

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleLoginClick(e) {
    e.preventDefault();
    // <Mutation mutation={LOGIN_MUTATION}>
    //   {(runLogin, {data}) => (
    //     runLogin({variables: {email: this.state.email, password: this.state.password}})
    //   )}
    // </Mutation>;
  }

  handleMailChange(e) {
    console.log('MailChangeEvent -> ', e.target.value);
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    console.log('PasswordChangeEvent -> ', e.target.value);
    this.setState({password: e.target.value});
  }

  render() {
    const style = {loginLabel: {'color': 'white', 'backgroundColor': 'rgb(53, 58, 63)'}};
    return (
      // <Container className="d-flex flex-column justify-content-between h-100" fluid="true">
      <Container className="d-flex flex-column justify-content-between" fluid="true">
        {/* <Row className="d-flex flex-column">
          <Navbar bg="dark" variant="dark" >
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Form inline>
              <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar>
        </Row> */}
        <Row>
          <Col className="d-flex flex-row justify-content-center">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label style={style.loginLabel}>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="Introduzca su dirección de correo" autoComplete="email" value={this.state.email} onChange={(e) => this.handleMailChange(e)} />
                <Form.Text className="text-muted">
                  Nunca compartiremos tu dirección de correo electrónico con nadie.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" >
                <Form.Label style={style.loginLabel}>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" autoComplete="current-password" value={this.state.password} onChange={(e) => this.handlePasswordChange(e)} />
              </Form.Group>
              <Button variant="dark" size="lg" type="submit" onClick={(e) => this.handleLoginClick(e)}>
                Confirmar
              </Button>
              <Button variant="dark" size="lg" type="submit">
                Reset
              </Button>
              {/* <Button style={{'color': 'red', 'backgroundColor': 'green'}}>
                Reset
              </Button> */}
            </Form>
          </Col>
        </Row>
        {/* <Row className="d-flex flex-column">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              {' React Bootstrap'}
            </Navbar.Brand>
          </Navbar>
        </Row> */}
      </Container>
    ); // End return-render
  }
}
