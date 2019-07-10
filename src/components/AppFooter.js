/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class AppFooter extends Component {
  render() {
    return (
      <Container fluid="true">
        <Row className="flex-column">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              {' React Bootstrap'}
            </Navbar.Brand>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppFooter;
