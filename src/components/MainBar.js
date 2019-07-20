/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col} from 'react-bootstrap';
import { ENTITY_VISIBLE_ID_NOTES, ENTITY_VISIBLE_ID_BOARDS, ENTITY_VISIBLE_ID_TASKLISTS } from '../redux/constants/action-types';


export default class MainBar extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  dropDownOnSelect(eventKey, event) {
    // this.props.setEntityVisible()
    console.log("EventKey recibido: ", eventKey);
  }

  render() {
    return (
      <Container className="p-0" fluid="true">
        <Navbar variant="dark" bg="dark" expand="xl" >

        {this.props.entityVisible === ENTITY_VISIBLE_ID_NOTES && <Navbar.Brand>Notas</Navbar.Brand>}
        {this.props.entityVisible === ENTITY_VISIBLE_ID_BOARDS && <Navbar.Brand>Pizarras</Navbar.Brand>}
        {this.props.entityVisible === ENTITY_VISIBLE_ID_TASKLISTS && <Navbar.Brand>Listas de tareas</Navbar.Brand>}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Ir a" id="entity-nav-dropdown">
                {this.props.entityVisible != ENTITY_VISIBLE_ID_TASKLISTS && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_TASKLISTS} onSelect={this.dropDownOnSelect}>Listas de tareas</NavDropdown.Item>}
                {this.props.entityVisible != ENTITY_VISIBLE_ID_NOTES && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_NOTES} onSelect={this.dropDownOnSelect}>Notas</NavDropdown.Item>}
                {this.props.entityVisible != ENTITY_VISIBLE_ID_BOARDS && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_BOARDS} onSelect={this.dropDownOnSelect}>Pizarras</NavDropdown.Item>}
              </NavDropdown>
            </Nav>
            <Button variant="outline-info">Crear</Button>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}

