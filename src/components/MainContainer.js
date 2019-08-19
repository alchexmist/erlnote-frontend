/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row} from 'react-bootstrap';
import LoadMainBar from '../containers/LoadMainBar';
import {ENTITY_VISIBLE_ID_NOTES, ENTITY_VISIBLE_ID_BOARDS, ENTITY_VISIBLE_ID_TASKLISTS} from '../redux/constants/action-types';
import LoadBoards from '../containers/LoadBoards';
import LoadTasklists from '../containers/LoadTasklists';
import LoadNotes from '../containers/LoadNotes';

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
          { this.props.entityVisible === ENTITY_VISIBLE_ID_NOTES &&
          <LoadNotes />
          }
          { this.props.entityVisible === ENTITY_VISIBLE_ID_BOARDS &&
          <LoadBoards />
          }
          { this.props.entityVisible === ENTITY_VISIBLE_ID_TASKLISTS &&
          <LoadTasklists />
          }
        </Row>
      </Container>
    );
  }
}

export default MainContainer;
