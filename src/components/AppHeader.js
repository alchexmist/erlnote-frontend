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
    return this.props.userID && this.props.userName && this.props.token;
  }

  handleLogoutButtonClick(e) {
    this.props.logout();
    window.localStorage.removeItem(ACCESS_TOKEN_PARAM);
    // this.props.history.push('/');
  }

  render() {
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
              {!this.isAuth() &&
              <Form inline>
                <Navbar.Text className="mr-3">Usuario anónimo</Navbar.Text>
                <Button variant="outline-light" >Registrarse</Button>
              </Form> && <Redirect to={'/'} />}
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppHeader;
