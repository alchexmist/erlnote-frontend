/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Button, Container} from 'react-bootstrap';
import {ENTITY_VISIBLE_ID_NOTES, ENTITY_VISIBLE_ID_BOARDS, ENTITY_VISIBLE_ID_TASKLISTS} from '../redux/constants/action-types';
import {ACTION_CREATE_BOARD} from '../redux/constants/action-types';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

const CREATE_BOARD_MUTATION = gql`
    mutation CreateBoard {
      board: createBoard {
        id
        title
        text
      }
    }`;

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

  handleCreateBoardClick(userActionName, boardData) {
    this.props.addNewBoard(boardData);
    this.props.setUserAction({userActionName: userActionName, actionEntityID: boardData.boardID});
  }

  render() {
    if (this.props.userAction === ACTION_CREATE_BOARD) {
      return <Redirect to={'/edit/board/' + this.props.userActionEntityID} />;
    }

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
            {/* {this.props.entityVisible == ENTITY_VISIBLE_ID_BOARDS &&<Button variant="outline-info" onClick={() => this.handleCreateBoardClick(ACTION_CREATE_BOARD)} >Crear pizarra</Button>} */}
            {this.props.entityVisible == ENTITY_VISIBLE_ID_BOARDS &&
              <Mutation mutation={CREATE_BOARD_MUTATION}
                onCompleted={({board}) => {
                  console.log('Board ID: ', board.id);
                  console.log('Board Title: ', board.title);
                  console.log('Board Text: ', board.text);
                  this.handleCreateBoardClick(ACTION_CREATE_BOARD, {boardID: board.id, boardTitle: board.title, boardText: board.text});
                }}>
                {(createBoard, {data}) => (
                  <Button variant="outline-info" onClick={() => createBoard()} >Crear pizarra</Button>
                )}
              </Mutation>
            }
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}

