/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {LinkContainer} from 'react-router-bootstrap';

class AppHeader extends Component {
  render() {
    return (
      <Container className="p-0" fluid="true">
        <Row className="flex-column m-0">
          <Navbar bg="dark" variant="dark" >
            <Navbar.Brand href="#home">erlNote</Navbar.Brand>
            <Nav className="mr-auto">
              <LinkContainer to="/login"><Nav.Link>Home</Nav.Link></LinkContainer>
              <LinkContainer to="/login"><Nav.Link>Features</Nav.Link></LinkContainer>
              <LinkContainer to="/login"><Nav.Link>Pricing</Nav.Link></LinkContainer>
            </Nav>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppHeader;
