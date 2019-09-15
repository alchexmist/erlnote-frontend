/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Row, Tabs, Tab} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Query, Subscription} from 'react-apollo';

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

const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($noteData: UpdateNoteInput!) {
    note: updateNote(input: $noteData) {
      id
      title
      body
      tags {
        id
        name
      }
      updatedBy
    }
  }`;

const GET_NOTE_ACCESS_INFO_QUERY = gql`
  query GetAccessInfo($entityId: ID!) {
    getAccessInfo(entityId: $entityId, entityType: NOTE) {
      ... on NoteAccessInfo {
        ownerId
        userId
        canRead
        canWrite
        noteId
      }
    }
  }`;

const ADD_NOTE_CONTRIBUTOR_MUTATION = gql`
  mutation AddNoteContributor($data: AddNoteContributorFilter!) {
    addNoteContributor(filter: $data) {
      msg
    }
  }`;

const DELETE_NOTE_CONTRIBUTOR_MUTATION = gql`
  mutation DeleteNoteContributor($data: DeleteNoteContributorFilter!) {
    deleteNoteContributor(filter: $data) {
      msg
    }
  }`;

const UPDATE_NOTE_ACCESS_MUTATION = gql`
  mutation UpdateNoteAccess($noteAccessData: UpdateNoteAccessInput!) {
    updateNoteAccess(input: $noteAccessData) {
      ... on NoteAccessInfo {
        ownerId
        userId
        canRead
        canWrite
        noteId
      }
    }
  }`;

const LINK_TAG_TO_NOTE_MUTATION = gql`
  mutation LinkTagToNote($noteID: ID!, $tagName: String!) {
    tag: linkTagToNote(noteId: $noteID, tagName: $tagName) {
      id
      name
    }
  }`;

const REMOVE_TAG_FROM_NOTE_MUTATION = gql`
  mutation RemoveTagFromNote($noteID: ID!, $tagName: String!) {
    removeTagFromNote(noteId: $noteID, tagName: $tagName) {
      msg
    }
  }`;

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNoteUser($data: ID!) {
    deleteNoteUser(noteId: $data) {
      id
      title
    }
  }`;

const NOTE_UPDATED_SUBSCRIPTION = gql`
  subscription NoteUpdated($noteId: ID!) {
    noteUpdated(noteId: $noteId) {
      id
      title
      body
      tags {
        id
        name
      }
      updatedBy
    }
  }`;

const NOTE_TAG_CREATED_SUBSCRIPTION = gql`
  subscription NoteTagCreated($noteId: ID!) {
    noteTagCreated(noteId: $noteId) {
        id
        name
        noteId
        updatedBy
    }
  }`;

const NOTE_TAG_DELETED_SUBSCRIPTION = gql`
  subscription NoteTagDeleted($noteId: ID!) {
    noteTagDeleted(noteId: $noteId) {
        msg
        entityId
        updatedBy
    }
  }`;

class EditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titleCursorOffset: 0,
      textAreaCursorOffset: 0,
      //   newTaskName: '',
      addTagTextfield: '',
      addContributorTextfield: '',
      readWriteRadioChecked: true,
      onlyReadRadioChecked: false,
      userCanEdit: true,
    };

    // Referencia (Ref) a entrada de título
    this.noteTitleInput = React.createRef();
    this.textAreaInput = React.createRef();
    // this.newTaskTextField = React.createRef();
    this.addTagButton = React.createRef();
    this.noteContributorInput = React.createRef();

    this.moreMutations = false;
  }

  componentDidMount() {
    // document.getElementById('root').scrollTop = 0;
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
    // this.tasklistTitleInput.current.focus();
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

  handleTitleChange(updateNote, e) {
    const newTitle = (e.target.value.length > 0) ? fixAccentMark(e.target.value) : '<Sin título>';
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    console.log('TITLE REF: ', this.noteTitleInput);
    this.noteTitleInput.current.value = newTitle;
    this.noteTitleInput.current.selectionStart = this.noteTitleInput.current.selectionEnd = cursorStart;
    this.setState({titleCursorOffset: cursorStart});

    updateNote({variables: {noteData: {
      'id': this.props.noteID,
      'title': newTitle,
      'body': this.props.noteBody
    }}});
  }

  handleAddContributorButton(addNoteContributor, e) {
    addNoteContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.addContributorTextfield,
      'nid': this.props.noteID,
      'canRead': true,
      'canWrite': this.state.readWriteRadioChecked,
    }}});
    this.noteContributorInput.current.focus();
  }

  handleDeleteContributorButton(deleteNoteContributor, e) {
    deleteNoteContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.addContributorTextfield,
      'nid': this.props.noteID,
    }}});
    this.noteContributorInput.current.focus();
  }

  handleUpdateNoteAccessButton(updateNoteAccess, e) {
    updateNoteAccess({variables: {'noteAccessData': {
      'userName': this.state.addContributorTextfield,
      'noteId': this.props.noteID,
      'canRead': true,
      'canWrite': this.state.readWriteRadioChecked,
    }}});
    this.noteContributorInput.current.focus();
  }

  handleAddTagButton(linkTagToNote, e) {
    // this.addTagButton.current.value
    linkTagToNote({variables: {
      noteID: this.props.noteID,
      tagName: this.state.addTagTextfield,
    }});
  }

  handleRemoveTagButton(removeTagFromNote, e) {
    // this.addTagButton.current.value
    this.props.removeTagNote({noteID: this.props.noteID, name: this.state.addTagTextfield});
    removeTagFromNote({variables: {
      noteID: this.props.noteID,
      tagName: this.state.addTagTextfield,
    }});
  }

  handleDeleteNoteButton(deleteNoteUser, e) {
    deleteNoteUser({variables: {data: this.props.noteID}});
    this.props.deleteNote({noteID: this.props.noteID});
    this.props.history.push('/dashboard');
  }

  handleTextAreaChange(updateNote, e) {
    const newText = fixAccentMark(e.target.value);
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    this.textAreaInput.current.value = newText;
    this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = cursorStart;
    this.setState({textAreaCursorOffset: cursorStart});

    updateNote({variables: {noteData: {
      'id': this.props.noteID,
      'title': this.props.noteTitle,
      'body': newText,
    }}});
  }

  noteTag(t) {
    return (
      <Badge key={t.id} className="mx-1" pill variant="dark">
        {t.name}
      </Badge>
    );
  }

  render() {
    //   {/* EL IDENTIFICADOR DE LA NOTA DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          <Subscription
            subscription={NOTE_UPDATED_SUBSCRIPTION}
            variables={{noteId: this.props.noteID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.noteUpdated;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.updateNote({id: data.id, title: data.title, body: data.body, tags: data.tags, __typename: 'Note'});
                const currentTitleOffset = this.noteTitleInput.current.selectionStart;
                this.noteTitleInput.current.value = data.title;
                // this.noteTitleInput.current.selectionStart = this.noteTitleInput.current.selectionEnd = this.state.titleCursorOffset;
                this.noteTitleInput.current.selectionStart = this.noteTitleInput.current.selectionEnd = currentTitleOffset;
                const currentTextAreaOffset = this.textAreaInput.current.selectionStart;
                this.textAreaInput.current.value = data.body;
                // this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = this.state.textAreaCursorOffset;
                this.textAreaInput.current.selectionStart = this.textAreaInput.current.selectionEnd = currentTextAreaOffset;
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Query query={GET_NOTE_ACCESS_INFO_QUERY}
            variables={{entityId: this.props.match.params.id}}
            fetchPolicy={'cache-and-network'}
            onCompleted={({getAccessInfo}) => {
              console.log('QUERY RESULT: ', getAccessInfo.canWrite);
              this.setState({userCanEdit: getAccessInfo.canWrite});
            }}
          >
            {({loading, error, data}) => {
              if (loading) return null;
              if (error) return null;

              return null;
            }}
          </Query>
          <Mutation mutation={UPDATE_NOTE_MUTATION}
            onCompleted={({note}) => {
              this.props.updateNote({id: note.id, title: note.title, body: note.body, tags: note.tags, __typename: 'Note'});
              this.unsetMoreMutations();
            }}>
            {(updateNote, {data}) => (
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Título</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control ref={this.noteTitleInput} disabled={!this.state.userCanEdit} size="lg" type="text" placeholder="Título de la nota" defaultValue={(this.props.noteTitle !== null) ? this.props.noteTitle : 'No ha sido posible obtener el título'} onChange={(e) => this.handleTitleChange(updateNote, e)} onClick={(e) => this.setState({titleCursorOffset: e.target.selectionStart})}/>
              </InputGroup>
            )}
          </Mutation>
          <Tabs id="uncontrolled-tab-notes-actions" className="mt-5 mb-3" variant="pills">
            <Tab eventKey="notes-contributors" disabled={!this.state.userCanEdit} title="Colaboradores">
              <Container className="mb-5">
                <Row className="justify-content-start">
                  <Col xs lg md sm xl="4">
                    <Form.Control ref={this.noteContributorInput} placeholder="Nombre de usuario" value={this.state.addContributorTextfield} onChange={(e) => this.setState({addContributorTextfield: e.target.value})}/>
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Form.Check
                      custom
                      inline
                      label="Leer"
                      type="radio"
                      checked={this.state.onlyReadRadioChecked}
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          this.setState({onlyReadRadioChecked: true, readWriteRadioChecked: false});
                        } else {
                          this.setState({onlyReadRadioChecked: false, readWriteRadioChecked: true});
                        }
                      }}
                      id="note-read-only"
                    />

                    <Form.Check
                      custom
                      inline
                      label="Leer y editar"
                      type="radio"
                      checked={this.state.readWriteRadioChecked}
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          this.setState({onlyReadRadioChecked: false, readWriteRadioChecked: true});
                        } else {
                          this.setState({onlyReadRadioChecked: true, readWriteRadioChecked: false});
                        }
                      }}
                      id="note-read-write"
                    />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Dropdown as={ButtonGroup}>
                      <Mutation mutation={ADD_NOTE_CONTRIBUTOR_MUTATION}
                        onCompleted={({addNoteContributor}) => {
                          console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN: ', addNoteContributor.msg);
                          this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                        }}>
                        {(addNoteContributor, {data}) => (
                          <Button variant="success" onClick={(e) => this.handleAddContributorButton(addNoteContributor, e)}>Añadir</Button>
                        )}
                      </Mutation>
                      <Dropdown.Toggle split variant="success" id="dropdown-split-remove-note-contributor" />
                      <Dropdown.Menu>
                        <Mutation mutation={DELETE_NOTE_CONTRIBUTOR_MUTATION}
                          onCompleted={({deleteNoteContributor}) => {
                            console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN DE BORRADO: ', deleteNoteContributor.msg);
                            this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                          }}>
                          {(deleteNoteContributor, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleDeleteContributorButton(deleteNoteContributor, e)}>Eliminar</Dropdown.Item>
                          )}
                        </Mutation>
                        <Mutation mutation={UPDATE_NOTE_ACCESS_MUTATION}
                          onCompleted={({updateNoteAccess}) => {
                            console.log('UPDATE NOTE ACCESS: ', updateNoteAccess.userId, updateNoteAccess.noteId, updateNoteAccess.canWrite);
                            this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                          }}>
                          {(updateNoteAccess, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleUpdateNoteAccessButton(updateNoteAccess, e)}>Actualizar permisos</Dropdown.Item>
                          )}
                        </Mutation>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="tasklist-tags" disabled={!this.state.userCanEdit} title="Etiquetas">
              <Container className="mb-5">
                <Row className="justify-content-start">
                  <Col xs lg md sm xl="4">
                    <Form.Control ref={this.addTagButton} placeholder="Nombre de la etiqueta" value={this.state.addTagTextfield} onChange={(e) => this.setState({addTagTextfield: e.target.value})} />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Dropdown as={ButtonGroup}>
                      <Mutation mutation={LINK_TAG_TO_NOTE_MUTATION}
                        onCompleted={({tag}) => {
                          console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN: ', tag.id, tag.name);
                          this.props.addTagNote({noteID: this.props.noteID, id: tag.id, name: tag.name});
                          this.setState({addTagTextfield: ''});
                        }}>
                        {(linkTagToNote, {data}) => (
                          <Button variant="success" onClick={(e) => this.handleAddTagButton(linkTagToNote, e)}>Añadir</Button>
                        )}
                      </Mutation>
                      <Dropdown.Toggle split variant="success" id="dropdown-split-tags" />

                      <Dropdown.Menu>
                        <Mutation mutation={REMOVE_TAG_FROM_NOTE_MUTATION}
                          onCompleted={({removeTagFromNote}) => {
                            // console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN BORRADO: ', removeTagFromTasklist.msg);
                            this.setState({addTagTextfield: ''});
                          }}>
                          {(removeTagFromNote, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleRemoveTagButton(removeTagFromNote, e)}>Eliminar</Dropdown.Item>
                          )}
                        </Mutation>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="tasklist-delete" title="Eliminar nota">
              <Container className="mb-5">
                <Row className="justify-content-center">
                  <Col xs lg md sm xl="4">
                    <Mutation mutation={DELETE_NOTE_MUTATION}
                      onCompleted={({deleteNoteUser}) => {
                        console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN BORRADO: ', deleteNoteUser.id, deleteNoteUser.body);
                      }}>
                      {(deleteNoteUser, {data}) => (
                        <Button variant='danger' onClick={(e) => this.handleDeleteNoteButton(deleteNoteUser, e)}>Eliminar nota</Button>
                      )}
                    </Mutation>
                  </Col>
                </Row>
              </Container>
            </Tab>
          </Tabs>

          <Mutation mutation={UPDATE_NOTE_MUTATION}
            onCompleted={({note}) => {
              this.props.updateNote({id: note.id, title: note.title, body: note.body, tags: note.tags, __typename: 'Note'});
              this.unsetMoreMutations();
            }}>
            {(updateNote, {data}) => (
              <Form.Row>
                <Form.Group as={Col} controlId="formGridNoteTextArea">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="note-text-ig">Contenido</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control ref={this.textAreaInput} as="textarea" rows="10" defaultValue={(this.props.noteBody !== null) ? this.props.noteBody : ''} onChange={(e) => this.handleTextAreaChange(updateNote, e)} onClick={(e) => this.setState({textAreaCursorOffset: e.target.selectionStart})} />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            )}
          </Mutation>

          <Form.Row className="my-5" style={{'maxHeight': 100, 'overflowY': 'auto'}}>
            {this.props.noteTags.map((t) => this.noteTag(t))}
          </Form.Row>

          <Subscription
            subscription={NOTE_TAG_CREATED_SUBSCRIPTION}
            variables={{noteId: this.props.noteID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.noteTagCreated;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.addTagNote({noteID: this.props.noteID, id: data.id, name: data.name});
                this.setState({state: this.state});
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Subscription
            subscription={NOTE_TAG_DELETED_SUBSCRIPTION}
            variables={{noteId: this.props.noteID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.noteTagDeleted;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.removeTagNote({noteID: this.props.noteID, name: data.msg});
                this.setState({state: this.state});
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>

        </Form>
      </Container>
    );
  }
}

export default withRouter(EditNote);
