/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Button, ButtonGroup, SplitButton, Dropdown, Form, InputGroup} from 'react-bootstrap';
// import LoadMainBar from '../containers/LoadMainBar';
// import LoadMainContent from '../containers/LoadMainContent';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Subscription} from 'react-apollo';

const UPDATE_BOARD_MUTATION = gql`
  mutation UpdateBoard($boardData: UpdateBoardInput!) {
    board: updateBoard(input: $boardData) {
      id
      text
      title
    }
  }`;

const ADD_BOARD_CONTRIBUTOR_MUTATION = gql`
mutation AddBoardContributor($data: AddBoardContributorFilter!) {
    addBoardContributor(filter: $data) {
    msg
}}`;

const DELETE_BOARD_CONTRIBUTOR_MUTATION = gql`
mutation DeleteBoardContributor($data: DeleteBoardContributorFilter!) {
    deleteBoardContributor(filter: $data) {
    msg
}}`;

const BOARD_UPDATED_SUBSCRIPTION = gql`
subscription BoardUpdated($boardId: ID!) {
    boardUpdated(boardId: $boardId) {
    id
    title
    text
}}`;

const fixAccentMark = (string) => string.replace(/\´a/g, 'á').replace(/\´e/g, 'é').replace(/\´i/g, 'í').replace(/\´o/g, 'ó').replace(/\´u/g, 'ú').replace(/\´A/g, 'Á').replace(/\´E/g, 'É').replace(/\´I/g, 'Í').replace(/\´O/g, 'Ó').replace(/\´U/g, 'Ú');

class EditBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {contributorUserName: ''};
    // this.state = {

    // };
  }

  componentDidMount() {
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
  }

  handleTextAreaChange(updateBoard, e) {
    const newText = fixAccentMark(e.target.value);
    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': newText,
      'title': this.props.boardTitle,
    }}});
  }

  handleTitleChange(updateBoard, e) {
    const newTitle = fixAccentMark(e.target.value);
    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': this.props.boardText,
      'title': newTitle,
    }}});
  }

  handleAddContributorClick(addBoardContributor, e) {
    e.preventDefault();
    console.log('ADDCONTRIBUTOR', this.state.contributorUserName);
    // AQUI HAY QUE DISPARAR LA MUTATION ADD_BOARD_CONTRIBUTOR CON ID DE COLABORADOR === this.state.contributorUserName e BOARD_ID this.props.boardID
    addBoardContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.contributorUserName,
      'bid': this.props.boardID,
    }}});
    this.setState({contributorUserName: ''});
  }

  handleDeleteContributorClick(deleteBoardContributor, e) {
    e.preventDefault();
    console.log('DELETECONTRIBUTOR', this.state.contributorUserName);
    // AQUI HAY QUE DISPARAR LA MUTATION DELETE_BOARD_CONTRIBUTOR CON ID DE COLABORADOR === this.state.contributorUserName e BOARD_ID this.props.boardID
    deleteBoardContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.contributorUserName,
      'bid': this.props.boardID,
    }}});
    this.setState({contributorUserName: ''});
  }

  //   FALTA ACTUALIZAR REDUX STORE
  //   FALTA EMBEBER MUTACIONES EN SUSCRIPCIÓN.
  render() {
    //   {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          {/* <Subscription
            subscription={BOARD_UPDATED_SUBSCRIPTION}
            variables={{boardId: this.props.boardID}}
            shouldResubscribe={true}
            onSubscriptionData={({subscriptionData}) => {
              console.log('Suscripción realizada con éxito.');
            }}>

          </Subscription> */}

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
            <Mutation mutation={UPDATE_BOARD_MUTATION}
              onCompleted={({board}) => {
                console.log('Board ID: ', board.id);
                console.log('Board Title: ', board.title);
                console.log('Board Text: ', board.text);
                this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
                // this.props.onLoginClick(login.user.id, login.user.username, login.token);
                // localStorage.setItem(ACCESS_TOKEN_PARAM, login.token);
                // console.log('MY TOKEN: ', localStorage.getItem(ACCESS_TOKEN_PARAM));
                // this.setState({redirectToDashboard: true});
                // client.writeData({ data: { isLoggedIn: true } });
              }}>
              {(updateBoard, {data}) => (
                <Form.Group as={Col} controlId="formGridBoardTitle">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-title">Título</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" placeholder="Título de la pizarra" value={(this.props.boardTitle !== null) ? this.props.boardTitle : ''} onChange={(e) => this.handleTitleChange(updateBoard, e)} />
                  </InputGroup>
                </Form.Group>
              )}
            </Mutation>
          </Form.Row>

          <Mutation mutation={UPDATE_BOARD_MUTATION}
            onCompleted={({board}) => {
              console.log('Board ID: ', board.id);
              console.log('Board Title: ', board.title);
              console.log('Board Text: ', board.text);
              this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
            // this.props.onLoginClick(login.user.id, login.user.username, login.token);
            // localStorage.setItem(ACCESS_TOKEN_PARAM, login.token);
            // console.log('MY TOKEN: ', localStorage.getItem(ACCESS_TOKEN_PARAM));
            // this.setState({redirectToDashboard: true});
            // client.writeData({ data: { isLoggedIn: true } });
            }}>
            {(updateBoard, {data}) => (
              <Form.Row>
                <Form.Group as={Col} controlId="formGridBoardTextArea">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-text">Contenido</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="textarea" rows="10" value={(this.props.boardText !== null) ? this.props.boardText : ''} onChange={(e) => this.handleTextAreaChange(updateBoard, e)} />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            )}
          </Mutation>

          <Form.Row>
            <Form.Group as={Col} lg="4" md="4" sm="4" xl="4" xs="4" controlId="formGridBoardAddContributor">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="ig-contributor-username">Nick</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  placeholder="Añadir colaborador"
                  aria-label="Añadir colaborador"
                  value={this.state.contributorUserName}
                  onChange={(e) => this.setState({contributorUserName: e.target.value})}
                />
                <InputGroup.Append>
                  <Dropdown as={ButtonGroup}>
                    <Mutation mutation={ADD_BOARD_CONTRIBUTOR_MUTATION}
                      onCompleted={({addBoardContributor}) => {
                        console.log('Añadido colaborador a pizarra: ', addBoardContributor.msg);
                      }}>
                      {(addBoardContributor, {data}) => (
                        <Button variant="primary" onClick={(e) => this.handleAddContributorClick(addBoardContributor, e)}>Añadir</Button>
                      )}
                    </Mutation>
                    <Dropdown.Toggle split variant="primary" id="dropdown-split-add-contributor" />

                    <Dropdown.Menu>
                      <Mutation mutation={DELETE_BOARD_CONTRIBUTOR_MUTATION}
                        onCompleted={({deleteBoardContributor}) => {
                          console.log('Eliminado colaborador de pizarra: ', deleteBoardContributor.msg);
                        }}>
                        {(deleteBoardContributor, {data}) => (
                          <Dropdown.Item eventKey="1" onClick={(e) => this.handleDeleteContributorClick(deleteBoardContributor, e)}>Eliminar</Dropdown.Item>
                        )}
                      </Mutation>
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} lg="4" md="4" sm="4" xl="4" xs="4" controlId="formGridBoardDelete">
              <Button variant="danger">Eliminar pizarra</Button>
            </Form.Group>
          </Form.Row>

          <Button variant="primary" type="text" onClick={(e) => {
            e.preventDefault();
            this.props.history.push('/');
          }}>
                Volver a la página principal
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
