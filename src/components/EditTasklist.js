/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Row, Tabs, Tab} from 'react-bootstrap';
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
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Título</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control size="lg" type="text" placeholder="Título de la lista de tareas" />
          </InputGroup>

          <Tabs id="uncontrolled-tab-tasklist-actions" className="mt-5 mb-3" variant="pills">
            <Tab eventKey="tasklist-new-task" title="Nueva Tarea">
              <Form.Control type="text" className="mb-5" placeholder="Nombre de la tarea nueva a crear" />
            </Tab>
            <Tab eventKey="tasklist-contributors" title="Colaboradores">
              <Form className="mb-5">
                <Row className="justify-content-start">
                  <Col xs lg md sm xl="4">
                    <Form.Control placeholder="Nombre de usuario" />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Form.Check
                      custom
                      inline
                      label="Leer"
                      type="radio"
                      id="tasklist-read-only"
                    />

                    <Form.Check
                      custom
                      inline
                      label="Leer y editar"
                      type="radio"
                      id="tasklist-read-write"
                    />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Dropdown as={ButtonGroup}>
                      <Button variant="success">Split Button</Button>

                      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>
            </Tab>
            <Tab eventKey="contact" title="Etiquetas">
              <Form className="mb-5">
                <Row className="justify-content-start">
                  <Col xs lg md sm xl="4">
                    <Form.Control placeholder="Nombre de la etiqueta" />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Dropdown as={ButtonGroup}>
                      <Button variant="success">Split Button</Button>

                      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>
            </Tab>
          </Tabs>
          
          <ListGroup id="tasklist-listgroup" style={{'maxHeight': 300, 'overflowY': 'auto'}}>
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
            <ListGroup.Item as="div" variant="dark">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                </InputGroup.Prepend>
                <Form.Control className="mx-1" plaintext aria-label="Text input with checkbox" defaultValue="Primera tarea" />
                <InputGroup.Append>
                  <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    id="input-group-dropdown-2"
                  >
                    <Dropdown.Item href="#">Action</Dropdown.Item>
                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                  </DropdownButton>
                  <Button variant="outline-dark">Button</Button>
                  <Button variant="outline-danger">Eliminar</Button>
                </InputGroup.Append>
              </InputGroup>
            </ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Morbi leo risus</ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item as="div" variant="dark">Vestibulum at eros</ListGroup.Item>
          </ListGroup>

          <Form.Row className="my-5" style={{'maxHeight': 100, 'overflowY': 'auto'}}>
            <Badge className="mx-1" pill variant="primary">
    Primary
            </Badge>
            <Badge className="mx-1" pill variant="secondary">
    Secondary
            </Badge>
            <Badge className="mx-1" pill variant="success">
    Success
            </Badge>
            <Badge className="mx-1" pill variant="danger">
    Danger
            </Badge>
            <Badge className="mx-1" pill variant="warning">
    Warning
            </Badge>
            <Badge className="mx-1" pill variant="info">
    Info
            </Badge>
            <Badge className="mx-1" pill variant="light">
    Light
            </Badge>
            <Badge className="mx-1" pill variant="dark">
    Dark
            </Badge>
          </Form.Row>
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditTasklist);

