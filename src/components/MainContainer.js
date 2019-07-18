/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col} from 'react-bootstrap';
import MainBar from './MainBar';
import MainContent from './MainContent';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  render() {
    return (
      <Container className="d-flex flex-column mb-auto p-0" fluid>
        <Row className="m-0">
          <MainBar/>
        </Row>
        <Row className="ml-0 mr-0">
          <MainContent />
        </Row>
      </Container>
    );
  }
}

export default MainContainer;
