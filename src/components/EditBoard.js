/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Button, Form, InputGroup} from 'react-bootstrap';
// import LoadMainBar from '../containers/LoadMainBar';
// import LoadMainContent from '../containers/LoadMainContent';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

const UPDATE_BOARD_MUTATION = gql`
  mutation UpdateBoard($boardData: UpdateBoardInput!) {
    board: updateBoard(input: $boardData) {
      id
      text
      title
    }
  }`;

class EditBoard extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  componentDidMount() {
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
  }

  handleTextAreaChange(updateBoard, e) {
    console.log('EVENTOTEXTAREA', e.target.value);
    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': e.target.value,
      'title': this.props.boardTitle,
    }}});
  }

//   FALTA ACTUALIZAR REDUX STORE
//   FALTA ACTUALIZAR TITLE EN EVENTO
//   FALTA EMBEBER MUTACIONES EN SUSCRIPCIÓN.
  render() {
    //   {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          <Form.Row>
            <Form.Group as={Col} lg="2" md="2" sm="2" xl="2" xs="2" controlId="formGridBoardID">
              {/* <Form.Label>Password</Form.Label> */}
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="ig-id">ID</InputGroup.Text>
                </InputGroup.Prepend>
                {/* <Form.Control readOnly defaultValue={this.props.match.params.id} /> */}
                <Form.Control readOnly defaultValue={this.props.boardID} />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridBoardTitle">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="ig-title">Título</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Título de la pizarra" defaultValue={this.props.boardTitle}/>
              </InputGroup>
            </Form.Group>
          </Form.Row>
        
          <Mutation mutation={UPDATE_BOARD_MUTATION}>
            {(updateBoard, {data}) => (
              <Form.Row>
                <Form.Group as={Col} controlId="formGridBoardTextArea">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-text">Contenido</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="textarea" rows="10" defaultValue={this.props.boardText} onChange={(e) => this.handleTextAreaChange(updateBoard, e)} />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            )}
          </Mutation>

          <Button variant="primary" type="submit">
    Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditBoard);

{/* <Form.Group controlId="formGridAddress1">
<Form.Label>Address</Form.Label>
<Form.Control placeholder="1234 Main St" />
</Form.Group>

<Form.Group controlId="formGridAddress2">
<Form.Label>Address 2</Form.Label>
<Form.Control placeholder="Apartment, studio, or floor" />
</Form.Group>

<Form.Row>
<Form.Group as={Col} controlId="formGridCity">
  <Form.Label>City</Form.Label>
  <Form.Control />
</Form.Group>

<Form.Group as={Col} controlId="formGridState">
  <Form.Label>State</Form.Label>
  <Form.Control as="select">
    <option>Choose...</option>
    <option>...</option>
  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridZip">
  <Form.Label>Zip</Form.Label>
  <Form.Control />
</Form.Group>
</Form.Row>

<Form.Group id="formGridCheckbox">
<Form.Check type="checkbox" label="Check me out" />
</Form.Group> */}
