/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Button, Form, Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {LinkContainer} from 'react-router-bootstrap';
import {ACCESS_TOKEN_PARAM} from '../graphql-client';
import {Redirect} from 'react-router-dom';

class AppHeader extends Component {
  constructor(props) {
    super(props);
  }

  isAuth() {
    const isLogged = this.props.userID !== null && this.props.userName !== null && this.props.token !== null;
    if (!isLogged && window.localStorage.getItem(ACCESS_TOKEN_PARAM)) {
      window.localStorage.removeItem(ACCESS_TOKEN_PARAM);
    }
    return isLogged;
  }

  handleLogoutButtonClick(e) {
    this.props.logout();
    window.localStorage.removeItem(ACCESS_TOKEN_PARAM);
    // Redirección a la página de login
    this.props.history.push('/');
  }

  handleSignUpButtonClick(e) {
    this.props.history.push('/signup');
  }

  render() {
    // if (!this.isAuth()) {
    //   return <Redirect to={'/'} />;
    // }

    return (
      <Container className="p-0" fluid="true">
        <Row className="flex-column m-0">
          <Navbar bg="dark" variant="dark" >
            <Navbar.Brand href="#home">erlNote</Navbar.Brand>
            <Nav className="mr-auto">
              <LinkContainer to="/"><Nav.Link>Inicio</Nav.Link></LinkContainer>
            </Nav>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              {this.isAuth() &&
              <Form inline>
                <Navbar.Text className="mr-3">{this.props.userName} ({this.props.userID})</Navbar.Text>
                <Button variant="outline-light" onClick={(e) => this.handleLogoutButtonClick(e)}>Cerrar sesión</Button>
              </Form>}
              {console.log('ISAUTH', this.isAuth())}
              {!this.isAuth() &&
              <Form inline>
                <Navbar.Text className="mr-3">Usuario anónimo</Navbar.Text>
                <Button variant="outline-light" onClick={(e) => this.handleSignUpButtonClick(e)}>Registrarse</Button>
              </Form>}
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppHeader;
