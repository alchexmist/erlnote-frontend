/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Button, ButtonGroup, Dropdown, Form, InputGroup, ListGroup, Row} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Subscription} from 'react-apollo';


const fixAccentMark = (string) => string.replace(/\´a/g, 'á')
    .replace(/\´e/g, 'é')
    .replace(/\´i/g, 'í')
    .replace(/\´o/g, 'ó')
    .replace(/\´u/g, 'ú')
    .replace(/\´A/g, 'Á')
    .replace(/\´E/g, 'É')
    .replace(/\´I/g, 'Í')
    .replace(/\´O/g, 'Ó')
    .replace(/\´U/g, 'Ú');

class EditTasklist extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
  }

  render() {
    //   {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          
          <ListGroup>
            <ListGroup.Item as="div" variant="dark">
              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Col sm="1">
                  <Form.Check type="checkbox" aria-label="option 1" />
                </Col>
                {/* <Form.Label column sm="2">
      Email
                </Form.Label> */}
                <Col sm="10">
                  <Form.Control plaintext defaultValue="email@example.com" />
                </Col>
                <Col sm="1">
                  <Button variant="danger">
                      Eliminar
                  </Button>
                </Col>
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Morbi leo risus</ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditTasklist);

