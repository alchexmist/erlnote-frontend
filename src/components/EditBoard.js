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
      updated_by
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
    updated_by
}}`;

const fixAccentMark = (string) => string.replace(/\´a/g, 'á').replace(/\´e/g, 'é').replace(/\´i/g, 'í').replace(/\´o/g, 'ó').replace(/\´u/g, 'ú').replace(/\´A/g, 'Á').replace(/\´E/g, 'É').replace(/\´I/g, 'Í').replace(/\´O/g, 'Ó').replace(/\´U/g, 'Ú');

class EditBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contributorUserName: '',
      titleCursorOffset: 0,
      textAreaCursorOffset: 0,
    };

    // Referencia (Ref) a entrada de título
    this.titleInput = React.createRef();
    // Referencia (Ref) al contenido de la pizarra
    this.textAreaInput = React.createRef();

    this.moreMutations = 0;
  }

  componentDidMount() {
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
  }

  // setMoreMutations() {
  //   if (this.state === undefined || this.state.moreMutations === true) {
  //     window.setTimeout(this.setMoreMutations, 100); /* this checks the flag every 50 milliseconds*/
  //   } else {
  //     this.setState({moreMutations: true});
  //   }
  // }

  // unsetMoreMutations() {
  //   this.setState({moreMutations: false});
  // }

  setMoreMutations() {
    if (this.moreMutations > 0) {
      window.setTimeout(this.setMoreMutations, 100); /* this checks the flag every 50 milliseconds*/
    } else {
      this.moreMutations += 1;
    }
  }

  unsetMoreMutations() {
    this.moreMutations -= 1;
  }

  // componentDidUpdate(prevProps) {
  //   console.log('COMPONENTDIDUPDATE TITLE CURRENT VALUE: ', this.titleInput.current.value);
  //   this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
  // }

  handleTextAreaChange(updateBoard, e) {
    this.setMoreMutations();
    const newText = fixAccentMark(e.target.value);
    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': newText,
      'title': this.props.boardTitle,
    }}});
    const cursorStart = e.target.selectionStart;
    this.textAreaInput.current.value = newText;
    this.setState({textAreaCursorOffset: cursorStart});
  }

  handleTitleChange(updateBoard, e) {
    this.setMoreMutations();
    const newTitle = fixAccentMark(e.target.value);
    console.log('TITLE SIN ENVIAR: ', newTitle);
    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': this.props.boardText,
      'title': newTitle,
    }}});

    const cursorStart = e.target.selectionStart;
    //this.titleInput.current.value = newTitle;
    console.log('TITLE CURSOR OFFSET: ', cursorStart);
    this.setState({titleCursorOffset: cursorStart});
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
              const data = subscriptionData.data.boardUpdated;
              console.log('Suscripción realizada con éxito: ', data);
              this.props.updateBoard(data);
              // this.titleInput.current.value = data.title;
              // this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
              this.textAreaInput.current.value = data.text;
              this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
            }}>
          </Subscription> */}

          <Subscription
            subscription={BOARD_UPDATED_SUBSCRIPTION}
            variables={{boardId: this.props.boardID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.boardUpdated;
              if (data.updated_by !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA');
                console.log('Suscripción realizada con éxito: ', data);
                this.props.updateBoard(data);
                this.titleInput.current.value = data.title;
                this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
                this.textAreaInput.current.value = data.text;
                this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
              } else {
                console.log('SUSCRIPCIÓN IGNORADA');
              }
            }}>
          </Subscription>
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
                console.log('RECIBIDO TITLE MUTATION Board ID: ', board.id);
                console.log('RECIBIDO TITLE MUTATION Board Title: ', board.title);
                console.log('RECIBIDO TITLE MUTATION Board Text: ', board.text);
                console.log('RECIBIDO TITLE MUTATION Board Updated By: ', board.updated_by);
                this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
                this.titleInput.current.value = board.title;
                this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
                this.textAreaInput.current.value = board.text;
                this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
                this.unsetMoreMutations();
              }}>
              {(updateBoard, {data}) => (
                <Form.Group as={Col} controlId="formGridBoardTitle">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-title">Título</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* <Form.Control ref={this.titleInput} type="text" placeholder="Título de la pizarra" value={(this.props.boardTitle !== null) ? this.props.boardTitle : ''} onChange={(e) => this.handleTitleChange(updateBoard, e)} /> */}
                    <Form.Control ref={this.titleInput} type="text" placeholder="Título de la pizarra" defaultValue={(this.props.boardTitle !== null) ? this.props.boardTitle : ''} onChange={(e) => this.handleTitleChange(updateBoard, e)} onClick={(e) => this.setState({titleCursorOffset: e.target.selectionStart})} />
                  </InputGroup>
                </Form.Group>
              )}
            </Mutation>
          </Form.Row>

          <Mutation mutation={UPDATE_BOARD_MUTATION}
            onCompleted={({board}) => {
              console.log('RECIBIDO CONTENT MUTATION Board ID: ', board.id);
              console.log('RECIBIDO CONTENT MUTATION Board Title: ', board.title);
              console.log('RECIBIDO CONTENT MUTATION Board Text: ', board.text);
              console.log('RECIBIDO CONTENT MUTATION Board Updated By: ', board.updated_by);
              this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
              this.titleInput.current.value = board.title;
              this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
              this.textAreaInput.current.value = board.text;
              this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
              this.unsetMoreMutations();
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
                    {/* <Form.Control as="textarea" rows="10" value={(this.props.boardText !== null) ? this.props.boardText : ''} onChange={(e) => this.handleTextAreaChange(updateBoard, e)} /> */}
                    <Form.Control ref={this.textAreaInput} as="textarea" rows="10" defaultValue={(this.props.boardText !== null) ? this.props.boardText : ''} onChange={(e) => this.handleTextAreaChange(updateBoard, e)} onClick={(e) => this.setState({textAreaCursorOffset: e.target.selectionStart})} />
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
