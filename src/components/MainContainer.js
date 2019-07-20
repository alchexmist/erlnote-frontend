/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col} from 'react-bootstrap';
import LoadMainBar from '../containers/LoadMainBar';
import LoadMainContent from '../containers/LoadMainContent';

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
          <LoadMainBar />
        </Row>
        <Row className="ml-0 mr-0">
          <LoadMainContent />
        </Row>
      </Container>
    );
  }
}

export default MainContainer;
