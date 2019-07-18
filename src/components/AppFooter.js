/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {LinkContainer} from 'react-router-bootstrap';

class AppFooter extends Component {
  render() {
    return (
      <Container className="p-0" fluid="true">
        <Row className="flex-column m-0">
          <Navbar bg="dark" variant="dark">
            <LinkContainer to="/login">
              <Navbar.Brand>
                {' by @alchexmist'}
              </Navbar.Brand>
            </LinkContainer>
          </Navbar>
        </Row>
      </Container>
    );
  }
}

export default AppFooter;
