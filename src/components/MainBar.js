/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Button, Container} from 'react-bootstrap';
import {ENTITY_VISIBLE_ID_NOTES, ENTITY_VISIBLE_ID_BOARDS, ENTITY_VISIBLE_ID_TASKLISTS} from '../redux/constants/action-types';


export default class MainBar extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  entityDropDownOnSelect(eventKey, event) {
    this.props.setEntityVisible(eventKey);
    console.log('This props', this.props);
    console.log('EventKey recibido: ', eventKey);
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
                {this.props.entityVisible != ENTITY_VISIBLE_ID_TASKLISTS && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_TASKLISTS} onSelect={(eventKey, event) => this.entityDropDownOnSelect(eventKey, event)}>Listas de tareas</NavDropdown.Item>}
                {this.props.entityVisible != ENTITY_VISIBLE_ID_NOTES && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_NOTES} onSelect={(eventKey, event) => this.entityDropDownOnSelect(eventKey, event)}>Notas</NavDropdown.Item>}
                {this.props.entityVisible != ENTITY_VISIBLE_ID_BOARDS && <NavDropdown.Item eventKey={ENTITY_VISIBLE_ID_BOARDS} onSelect={(eventKey, event) => this.entityDropDownOnSelect(eventKey, event)}>Pizarras</NavDropdown.Item>}
              </NavDropdown>
            </Nav>
            {this.props.entityVisible == ENTITY_VISIBLE_ID_TASKLISTS &&<Button variant="outline-info">Crear lista de tareas</Button>}
            {this.props.entityVisible == ENTITY_VISIBLE_ID_NOTES &&<Button variant="outline-info">Crear nota</Button>}
            {this.props.entityVisible == ENTITY_VISIBLE_ID_BOARDS &&<Button variant="outline-info">Crear pizarra</Button>}
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}

