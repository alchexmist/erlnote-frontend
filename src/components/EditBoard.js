/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Accordion, Badge, Card, Col, Button, ButtonGroup, Dropdown, Form, InputGroup} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';
import gql from 'graphql-tag';
import {Query, Mutation, Subscription} from 'react-apollo';

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

const DELETE_BOARD_MUTATION = gql`
  mutation DeleteBoardUser($data: ID!) {
    deleteBoardUser(boardId: $data) {
      id
      title
    }
  }`;

const GET_BOARD_CONTRIBUTORS_QUERY = gql`
  query GetBoardContributors($boardId: ID!) {
    getBoardContributors(boardId: $boardId) {
      usernames
      boardId
    }
  }`;

const fixAccentMark = (string) => string.replace(/´a/g, 'á')
    .replace(/´e/g, 'é')
    .replace(/´i/g, 'í')
    .replace(/´o/g, 'ó')
    .replace(/´u/g, 'ú')
    .replace(/´A/g, 'Á')
    .replace(/´E/g, 'É')
    .replace(/´I/g, 'Í')
    .replace(/´O/g, 'Ó')
    .replace(/´U/g, 'Ú');

class EditBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contributorUserName: '',
      // titleCursorOffset: 0,
      // textAreaCursorOffset: 0,
    };

    // Referencia (Ref) a entrada de título
    this.titleInput = React.createRef();
    // Referencia (Ref) al contenido de la pizarra
    this.textAreaInput = React.createRef();

    this.moreMutations = false;
  }

  componentDidMount() {
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
  }

  setMoreMutations() {
    if (this.moreMutations === true) {
      window.setTimeout(this.setMoreMutations, 50); /* this checks the flag every 50 milliseconds*/
    } else {
      this.moreMutations = true;
    }
  }

  unsetMoreMutations() {
    this.moreMutations = false;
  }

  // componentDidUpdate(prevProps) {
  // }

  handleTextAreaChange(updateBoard, e) {
    const newText = fixAccentMark(e.target.value);
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    this.textAreaInput.current.value = newText;
    this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = cursorStart;
    // this.setState({textAreaCursorOffset: cursorStart});

    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': newText,
      'title': this.props.boardTitle,
    }}});
  }

  handleTitleChange(updateBoard, e) {
    const newTitle = fixAccentMark(e.target.value);
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    this.titleInput.current.value = newTitle;
    this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = cursorStart;
    // this.setState({titleCursorOffset: cursorStart});

    updateBoard({variables: {boardData: {
      'id': this.props.boardID,
      'text': this.props.boardText,
      'title': newTitle,
    }}});
  }

  handleAddContributorClick(addBoardContributor, e) {
    e.preventDefault();

    addBoardContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.contributorUserName,
      'bid': this.props.boardID,
    }}});

    this.setState({contributorUserName: ''});
  }

  handleDeleteContributorClick(deleteBoardContributor, e) {
    e.preventDefault();

    deleteBoardContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.contributorUserName,
      'bid': this.props.boardID,
    }}});

    this.setState({contributorUserName: ''});
  }

  handleDeleteBoardButton(deleteBoardUser, e) {
    deleteBoardUser({variables: {data: this.props.boardID}});
    this.props.deleteBoard({boardID: this.props.boardID});
    this.props.history.push('/dashboard');
  }

  render() {
    //   {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          <Subscription
            subscription={BOARD_UPDATED_SUBSCRIPTION}
            variables={{boardId: this.props.boardID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.boardUpdated;
              if (data.updated_by !== this.props.currentUserID) {
                const currentTitleCursorOffset = this.titleInput.current.selectionStart;
                const currentTextAreaCursorOffset = this.textAreaInput.current.selectionStart;
                this.props.updateBoard(data);
                this.titleInput.current.value = data.title;
                // this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = this.state.titleCursorOffset;
                this.titleInput.current.selectionStart = this.titleInput.current.selectionEnd = currentTitleCursorOffset;
                this.textAreaInput.current.value = data.text;
                // this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
                this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = currentTextAreaCursorOffset;
              }
            }}>
          </Subscription>
          <Form.Row>
            <Form.Group as={Col} lg="2" md="2" sm="2" xl="2" xs="2" controlId="formGridBoardID">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="ig-id">ID</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control readOnly defaultValue={this.props.boardID} />
              </InputGroup>
            </Form.Group>
            <Mutation mutation={UPDATE_BOARD_MUTATION}
              onCompleted={({board}) => {
                this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
                this.unsetMoreMutations();
              }}>
              {(updateBoard, {data}) => (
                <Form.Group as={Col} controlId="formGridBoardTitle">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-title">Título</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* <Form.Control ref={this.titleInput}
                      type="text"
                      placeholder="Título de la pizarra"
                      defaultValue={(this.props.boardTitle) ? this.props.boardTitle : ''}
                      onChange={(e) => this.handleTitleChange(updateBoard, e)}
                      onClick={(e) => this.setState({titleCursorOffset: e.target.selectionStart})}
                    /> */}
                    <Form.Control ref={this.titleInput}
                      type="text"
                      placeholder="Título de la pizarra"
                      defaultValue={(this.props.boardTitle) ? this.props.boardTitle : ''}
                      onChange={(e) => this.handleTitleChange(updateBoard, e)}
                    />
                  </InputGroup>
                </Form.Group>
              )}
            </Mutation>
          </Form.Row>

          <Mutation mutation={UPDATE_BOARD_MUTATION}
            onCompleted={({board}) => {
              this.props.updateBoard({id: board.id, title: board.title, text: board.text, __typename: 'Board'});
              this.unsetMoreMutations();
            }}>
            {(updateBoard, {data}) => (
              <Form.Row>
                <Form.Group as={Col} controlId="formGridBoardTextArea">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="ig-text">Contenido</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* <Form.Control ref={this.textAreaInput}
                      as="textarea"
                      rows="10"
                      defaultValue={(this.props.boardText) ? this.props.boardText : ''}
                      onChange={(e) => this.handleTextAreaChange(updateBoard, e)}
                      onClick={(e) => this.setState({textAreaCursorOffset: e.target.selectionStart})}
                    /> */}
                    <Form.Control ref={this.textAreaInput}
                      as="textarea"
                      rows="10"
                      defaultValue={(this.props.boardText) ? this.props.boardText : ''}
                      onChange={(e) => this.handleTextAreaChange(updateBoard, e)}
                    />
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
              <Mutation mutation={DELETE_BOARD_MUTATION}
                onCompleted={({deleteBoardUser}) => {
                  console.log(`Eliminada pizarra ${deleteBoardUser.id}`);
                }}
                onError={(error) => {
                  console.log('Error en mutación de borrado de la pizarra: ', error);
                }
                }>
                {(deleteBoardUser, {data}) => (
                  <Button variant="danger" onClick={(e) => this.handleDeleteBoardButton(deleteBoardUser, e)}>Eliminar pizarra</Button>
                )}
              </Mutation>
            </Form.Group>
          </Form.Row>

          <Query query={GET_BOARD_CONTRIBUTORS_QUERY}
            variables={{boardId: this.props.match.params.id}}
            fetchPolicy={'cache-and-network'}
            onCompleted={({getBoardContributors}) => {
              console.log('QUERY RESULT: ', getBoardContributors.usernames);
            }}
          >
            {({loading, error, data, refetch}) => {
              if (loading) return null;
              if (error) return null;

              return (
                <Accordion className="mb-3">
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
        Ver colaboradores
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <Card.Text>{data.getBoardContributors.usernames.map((u, index) => {return (<Badge key={index} className="mr-1" pill='true' variant='dark'>{u}</Badge>);})}</Card.Text>
                        <Button variant="success" onClick={() => refetch()}>Recargar</Button>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>);
            }}
          </Query>

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

