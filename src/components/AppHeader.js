/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class AppHeader extends Component {
  render() {
    return (
      <Container fluid="true">
        <Row className="flex-column">
          <Navbar bg="dark" variant="dark" >
            <Navbar.Brand href="#home">erlNote</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/login">Home</Nav.Link>
              <Nav.Link href="/login">Features</Nav.Link>
              <Nav.Link href="/login">Pricing</Nav.Link>
            </Nav>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppHeader;
