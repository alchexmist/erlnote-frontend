/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Row, Tabs, Tab} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Query, Subscription} from 'react-apollo';

const TASK_STATE_IN_PROGRESS = 'INPROGRESS';
const TASK_STATE_FINISHED = 'FINISHED';
const TASK_PRIORITY_LOW = 'LOW';
const TASK_PRIORITY_NORMAL = 'NORMAL';
const TASK_PRIORITY_HIGH = 'HIGH';

const UPDATE_TASKLIST_MUTATION = gql`
  mutation UpdateTasklist($tasklistData: UpdateTasklistInput!) {
    tasklist: updateTasklist(input: $tasklistData) {
      id
      title
      tasks {
        id
        name
        description
        state
        priority
        startDatetime
        endDatetime
      }
      tags {
        id
        name
      }
      updatedBy
    }
  }`;

const ADD_TASK_TO_TASKLIST_MUTATION = gql`
  mutation AddTaskToTasklist($taskData: AddTaskInput!) {
    task: addTaskToTasklist(input: $taskData) {
        id
        name
        description
        state
        priority
        startDatetime
        endDatetime
        tasklistId
    }
  }`;

const UPDATE_TASK_IN_TASKLIST_MUTATION = gql`
  mutation UpdateTaskInTasklist($taskData: UpdateTaskInput!) {
    task: updateTaskInTasklist(input: $taskData) {
        id
        name
        description
        state
        priority
        startDatetime
        endDatetime
        tasklistId
    }
  }`;

const LINK_TAG_TO_TASKLIST_MUTATION = gql`
  mutation LinkTagToTasklist($tasklistID: ID!, $tagName: String!) {
    tag: linkTagToTasklist(tasklistId: $tasklistID, tagName: $tagName) {
      id
      name
    }
  }`;

const REMOVE_TAG_FROM_TASKLIST_MUTATION = gql`
  mutation RemoveTagFromTasklist($tasklistID: ID!, $tagName: String!) {
    removeTagFromTasklist(tasklistId: $tasklistID, tagName: $tagName) {
      msg
    }
  }`;

const ADD_TASKLIST_CONTRIBUTOR_MUTATION = gql`
  mutation AddTasklistContributor($data: AddTasklistContributorFilter!) {
    addTasklistContributor(filter: $data) {
      msg
    }
  }`;

const DELETE_TASKLIST_CONTRIBUTOR_MUTATION = gql`
  mutation DeleteTasklistContributor($data: DeleteTasklistContributorFilter!) {
    deleteTasklistContributor(filter: $data) {
      msg
    }
  }`;

const DELETE_TASKLIST_MUTATION = gql`
  mutation DeleteTasklistUser($data: ID!) {
    deleteTasklistUser(tasklistId: $data) {
      id
      title
    }
  }`;

const GET_TASKLIST_ACCESS_INFO_QUERY = gql`
  query GetAccessInfo($entityId: ID!) {
    getAccessInfo(entityId: $entityId, entityType: TASKLIST) {
      ... on TasklistAccessInfo {
        ownerId
        userId
        canRead
        canWrite
        tasklistId
      }
    }
  }`;

const DELETE_TASK_FROM_TASKLIST_MUTATION = gql`
  mutation DeleteTaskFromTasklist($taskId: ID!, $tasklistId: ID!) {
    deleteTaskFromTasklist(taskId: $taskId, tasklistId: $tasklistId) {
      id
      name
      tasklistId
    }
  }`;

const UPDATE_TASKLIST_ACCESS_MUTATION = gql`
  mutation UpdateTasklistAccess($tasklistAccessData: UpdateTasklistAccessInput!) {
    updateTasklistAccess(input: $tasklistAccessData) {
      ... on TasklistAccessInfo {
        ownerId
        userId
        canRead
        canWrite
        tasklistId
      }
    }
  }`;

const TASKLIST_UPDATED_SUBSCRIPTION = gql`
  subscription TasklistUpdated($tasklistId: ID!) {
    tasklistUpdated(tasklistId: $tasklistId) {
      id
      title
      tasks {
        id
        name
        description
        state
        priority
        startDatetime
        endDatetime
      }
      tags {
        id
        name
      }
      updatedBy
    }
  }`;

const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription TaskUpdated($tasklistId: ID!, $taskId: ID!) {
    taskUpdated(tasklistId: $tasklistId, taskId: $taskId) {
        id
        name
        description
        state
        priority
        startDatetime
        endDatetime
        tasklistId
        updatedBy
    }
  }`;

const TASKLIST_TAG_CREATED_SUBSCRIPTION = gql`
  subscription TasklistTagCreated($tasklistId: ID!) {
    tasklistTagCreated(tasklistId: $tasklistId) {
        id
        name
        tasklistId
        updatedBy
    }
  }`;

const TASKLIST_TAG_DELETED_SUBSCRIPTION = gql`
  subscription TasklistTagDeleted($tasklistId: ID!) {
    tasklistTagDeleted(tasklistId: $tasklistId) {
        msg
        entityId
        updatedBy
    }
  }`;

const NEW_TASK_IN_TASKLIST_SUBSCRIPTION = gql`
  subscription NewTaskInTasklist($tasklistId: ID!) {
    newTaskInTasklist(tasklistId: $tasklistId) {
      id
      name
      description
      state
      priority
      startDatetime
      endDatetime
      tasklistId
      updatedBy
    }
  }`;

const DELETED_TASK_IN_TASKLIST_SUBSCRIPTION = gql`
  subscription DeletedTaskInTasklist($tasklistId: ID!) {
    deletedTaskInTasklist(tasklistId: $tasklistId) {
      id
      name
      description
      state
      priority
      startDatetime
      endDatetime
      tasklistId
      updatedBy
    }
  }`;

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
      titleCursorOffset: 0,
      newTaskName: '',
      addTagTextfield: '',
      addContributorTextfield: '',
      readWriteRadioChecked: true,
      onlyReadRadioChecked: false,
      userCanEdit: true,
    //   tasklistTextfieldItemRefs: {},
    };

    // Referencia (Ref) a entrada de título
    this.tasklistTitleInput = React.createRef();
    this.newTaskTextField = React.createRef();
    this.addTagButton = React.createRef();
    this.tasklistContributorInput = React.createRef();

    this.moreMutations = false;
  }

  componentDidMount() {
    document.getElementById('root').scrollTop = 0;
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
    this.tasklistTitleInput.current.focus();
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

  handleTitleChange(updateTasklist, e) {
    const newTitle = (e.target.value.length > 0) ? fixAccentMark(e.target.value) : '<Sin título>';
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    console.log('TITLE REF: ', this.tasklistTitleInput);
    this.tasklistTitleInput.current.value = newTitle;
    this.tasklistTitleInput.current.selectionStart = this.tasklistTitleInput.current.selectionEnd = cursorStart;
    this.setState({titleCursorOffset: cursorStart});

    updateTasklist({variables: {tasklistData: {
      'tasklistId': this.props.tasklistID,
      'title': newTitle,
    }}});
    // let withTitle = true;

    // if (e.target.value.length > 0) {
    //   newTitle = fixAccentMark(e.target.value);
    // } else {
    //   newTitle = '<Sin título>';
    //   withTitle = false;
    // }
    // if (withTitle) {
    // } else {
    //   this.tasklistTitleInput.current.selectionStart = cursorStart;
    //   this.tasklistTitleInput.current.selectionEnd = newTitle.length;
    // }
  }

  handleTaskNameChange(t, updateTaskInTasklist, e) {
    const currentLenGTZero = (e.target.value.length > 0) ? true : false;
    const newName = (currentLenGTZero) ? fixAccentMark(e.target.value) : '<Sin título>';
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    this[`taskTextfieldItemRef${t.id}`].value = newName;
    if (currentLenGTZero) {
      this[`taskTextfieldItemRef${t.id}`].selectionStart = this[`taskTextfieldItemRef${t.id}`].selectionEnd = cursorStart;
    } else {
      this[`taskTextfieldItemRef${t.id}`].selectionStart = 0;
      this[`taskTextfieldItemRef${t.id}`].selectionEnd = 12;
    }
    this.setState({[`taskTextfieldItemRef${t.id}CursorOffset`]: cursorStart});

    updateTaskInTasklist({variables: {taskData: {
      'id': t.id,
      'tasklistId': this.props.tasklistID,
      'name': newName,
      'state': t.state,
      'priority': t.priority,
    }}});
  }

  handleAddTaskButton(addTaskToTasklist, e) {
    console.log('AddTaskButton Value:', this.state.newTaskName);
    addTaskToTasklist({variables: {taskData: {
      'tasklistId': this.props.tasklistID,
      'name': this.state.newTaskName,
      'state': TASK_STATE_IN_PROGRESS,
      'priority': TASK_PRIORITY_NORMAL,
    }}});
    // this.setState({newTaskName: e.target.value});
  }

  handleFinishedTaskCheckbox(updateTaskInTasklist, t, e) {
    let newTaskState = null;
    console.log('ESTADO VIEJO DE LA TAREA: ', t.state);
    if (t.state === TASK_STATE_FINISHED) {
      newTaskState = TASK_STATE_IN_PROGRESS;
    } else {
      newTaskState = TASK_STATE_FINISHED;
    }
    console.log('ESTADO NUEVO DE LA TAREA: ', newTaskState);
    //Disparar la mutación de cambio de estado para la tarea.
    updateTaskInTasklist({variables: {taskData: {
      'id': t.id,
      'tasklistId': this.props.tasklistID,
      'name': t.name,
      'state': newTaskState,
      'priority': t.priority,
    }}});
    // QUEDA IMPLEMENTAR updateTask para Redux.
    // this.setState({ state: this.state });
  }

  handleTaskEditButton(taskID, e) {
    this[`taskTextfieldItemRef${taskID}`].focus();
  }

  handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e) {
    updateTaskInTasklist({variables: {taskData: {
      'id': t.id,
      'tasklistId': this.props.tasklistID,
      'name': t.name,
      'state': t.state,
      'priority': eventKey,
    }}});
  }

  handleAddTagButton(linkTagToTasklist, e) {
    // this.addTagButton.current.value
    linkTagToTasklist({variables: {
      tasklistID: this.props.tasklistID,
      tagName: this.state.addTagTextfield,
    }});
  }

  handleRemoveTagButton(removeTagFromTasklist, e) {
    // this.addTagButton.current.value
    this.props.removeTagTasklist({tasklistID: this.props.tasklistID, name: this.state.addTagTextfield});
    removeTagFromTasklist({variables: {
      tasklistID: this.props.tasklistID,
      tagName: this.state.addTagTextfield,
    }});
  }

  handleAddContributorButton(addTasklistContributor, e) {
    addTasklistContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.addContributorTextfield,
      'tid': this.props.tasklistID,
      'canRead': true,
      'canWrite': this.state.readWriteRadioChecked,
    }}});
    this.tasklistContributorInput.current.focus();
  }

  handleDeleteContributorButton(deleteTasklistContributor, e) {
    deleteTasklistContributor({variables: {data: {
      'type': 'USERNAME',
      'value': this.state.addContributorTextfield,
      'tid': this.props.tasklistID,
    }}});
    this.tasklistContributorInput.current.focus();
  }

  handleUpdateTasklistAccessButton(updateTasklistAccess, e) {
    updateTasklistAccess({variables: {'tasklistAccessData': {
      'userName': this.state.addContributorTextfield,
      'tasklistId': this.props.tasklistID,
      'canRead': true,
      'canWrite': this.state.readWriteRadioChecked,
    }}});
    this.tasklistContributorInput.current.focus();
  }

  handleDeleteTasklistButton(deleteTasklistUser, e) {
    deleteTasklistUser({variables: {data: this.props.tasklistID}});
    this.props.deleteTasklist({tasklistID: this.props.tasklistID});
    this.props.history.push('/dashboard');
  }

  handleDeleteTaskButton(taskId, deleteTaskFromTasklist, e) {
    this.props.deleteTask({tasklistID: this.props.tasklistID, id: taskId});
    deleteTaskFromTasklist({variables: {
      taskId: taskId,
      tasklistId: this.props.tasklistID,
    }});
    this.setState({state: this.state});
  }

  tasklistLine(t) {
    return (
      <ListGroup.Item key={t.id} as="div" variant="dark">
        <InputGroup>
          <InputGroup.Prepend>
            <Mutation mutation={UPDATE_TASK_IN_TASKLIST_MUTATION}
              onCompleted={({task}) => {
                this.props.updateTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
                console.log('ESTADO DE LA TAREA RESULTADO DE MUTACIÓN: ', task.state, task.tasklistId);
              }}>
              {(updateTaskInTasklist, {data}) => (
                <InputGroup.Checkbox key={t.id} disabled={!this.state.userCanEdit} aria-label="Marcar tarea como finalizada" checked={(t.state === TASK_STATE_FINISHED) ? true : false} onChange={(e) => this.handleFinishedTaskCheckbox(updateTaskInTasklist, t, e)} />
              )}
            </Mutation>
          </InputGroup.Prepend>
          <Mutation mutation={UPDATE_TASK_IN_TASKLIST_MUTATION}
            onCompleted={({task}) => {
              this.props.updateTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
              console.log('NOMBRE DE LA TAREA RESULTADO DE MUTACIÓN: ', task.name);
            }}>
            {(updateTaskInTasklist, {data}) => (
              <Form.Control ref={(input) => {this[`taskTextfieldItemRef${t.id}`] = input;}}
                disabled={!this.state.userCanEdit}
                className="mx-1"
                type="text"
                plaintext
                aria-label={t.name}
                key={t.id}
                style={(t.state === TASK_STATE_FINISHED) ? {'textDecoration': 'line-through'} : {'textDecoration': 'initial'}}
                defaultValue={t.name}
                onChange={(e) => this.handleTaskNameChange(t, updateTaskInTasklist, e)}
                onClick={(e) => this.setState({[`taskTextfieldItemRef${t.id}CursorOffset`]: e.target.selectionStart})} />
            )}
          </Mutation>
          <Subscription
            subscription={TASK_UPDATED_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID, taskId: t.id}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.taskUpdated;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.updateTask({tasklistID: this.props.tasklistID, id: data.id, name: data.name, description: data.description, state: data.state, priority: data.priority, startDatetime: data.startDatetime, endDatetime: data.endDatetime, __typename: 'Task'});
                this[`taskTextfieldItemRef${t.id}`].value = data.name;
                this[`taskTextfieldItemRef${t.id}`].selectionStart = this[`taskTextfieldItemRef${t.id}`].selectionEnd = this.state[`taskTextfieldItemRef${t.id}CursorOffset`];
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <InputGroup.Append>
            <Mutation mutation={UPDATE_TASK_IN_TASKLIST_MUTATION}
              onCompleted={({task}) => {
                this.props.updateTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
                console.log('ESTADO DE LA TAREA RESULTADO DE MUTACIÓN: ', task.state);
              }}>
              {(updateTaskInTasklist, {data}) => (
                <DropdownButton
                  variant={(t.priority === TASK_PRIORITY_NORMAL) ? 'warning' : ((t.priority === TASK_PRIORITY_HIGH) ? 'danger' : 'success')}
                  title={(t.priority === TASK_PRIORITY_NORMAL) ? 'Prioridad normal' : ((t.priority === TASK_PRIORITY_HIGH) ? 'Prioridad alta' : 'Prioridad baja')}
                  id="input-group-dropdown-2"
                  className="mr-1"
                  disabled={!this.state.userCanEdit}
                >
                  <Dropdown.Item eventKey={TASK_PRIORITY_LOW} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad baja</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey={TASK_PRIORITY_HIGH} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad alta</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey={TASK_PRIORITY_NORMAL} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad normal</Dropdown.Item>
                </DropdownButton>
              )}
            </Mutation>
            <Button variant="primary" className="mr-1" disabled={!this.state.userCanEdit} onClick={(e) => this.handleTaskEditButton(t.id, e)}>Editar</Button>
            <Mutation mutation={DELETE_TASK_FROM_TASKLIST_MUTATION}
              onCompleted={({deleteTaskFromTasklist}) => {
                // this.props.deleteTask({tasklistID: this.props.tasklistID, id: deleteTaskFromTasklist.id});
                console.log('TAREA ELIMINADA: ', deleteTaskFromTasklist.id, deleteTaskFromTasklist.name, deleteTaskFromTasklist.tasklistId);
              }}>
              {(deleteTaskFromTasklist, {data}) => (
                <Button variant="danger" disabled={!this.state.userCanEdit} onClick={(e) => this.handleDeleteTaskButton(t.id, deleteTaskFromTasklist, e)}>Eliminar</Button>
              )}
            </Mutation>
          </InputGroup.Append>
        </InputGroup>
      </ListGroup.Item>
    );
  }

  tasklistTag(t) {
    return (
      <Badge key={t.id} className="mx-1" pill variant="dark">
        {t.name}
      </Badge>
    );
  }

  render() {
    //   {/* EL IDENTIFICADOR DE LA LISTA DE TAREAS DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
          <Subscription
            subscription={TASKLIST_UPDATED_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.tasklistUpdated;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.updateTasklist({id: data.id, title: data.title, tasks: data.tasks, tags: data.tags, __typename: 'Tasklist'});
                this.tasklistTitleInput.current.value = data.title;
                this.tasklistTitleInput.current.selectionStart = this.tasklistTitleInput.current.selectionEnd = this.state.titleCursorOffset;
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Query query={GET_TASKLIST_ACCESS_INFO_QUERY}
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
          <Mutation mutation={UPDATE_TASKLIST_MUTATION}
            onCompleted={({tasklist}) => {
              this.props.updateTasklist({id: tasklist.id, title: tasklist.title, tasks: tasklist.tasks, tags: tasklist.tags, __typename: 'Tasklist'});
              this.unsetMoreMutations();
            }}>
            {(updateTasklist, {data}) => (
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Título</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control ref={this.tasklistTitleInput} disabled={!this.state.userCanEdit} size="lg" type="text" placeholder="Título de la lista de tareas" defaultValue={(this.props.tasklistTitle !== null) ? this.props.tasklistTitle : 'No ha sido posible obtener el título'} onChange={(e) => this.handleTitleChange(updateTasklist, e)} onClick={(e) => this.setState({titleCursorOffset: e.target.selectionStart})}/>
              </InputGroup>
            )}
          </Mutation>
          <Tabs id="uncontrolled-tab-tasklist-actions" className="mt-5 mb-3" variant="pills">
            <Tab eventKey="tasklist-new-task" title="Nueva Tarea">
              <Mutation mutation={ADD_TASK_TO_TASKLIST_MUTATION}
                onCompleted={({task}) => {
                  console.log('TASKLIST ID OF THE TASK: ', task.tasklistId);
                  this.props.addTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
                  this.setState({newTaskName: ''});
                  this.newTaskTextField.current.focus();
                }}>
                {(addTaskToTasklist, {data}) => (
                  <InputGroup className="mb-5">
                    <Form.Control ref={this.newTaskTextField} disabled={!this.state.userCanEdit} placeholder="Nombre de la tarea nueva a crear" aria-label="Nombre de la tarea nueva a crear" type="text" value={this.state.newTaskName} onChange={(e) => this.setState({newTaskName: e.target.value})} />
                    <InputGroup.Append>
                      <Button variant="success" disabled={!this.state.userCanEdit} onClick={(e) => this.handleAddTaskButton(addTaskToTasklist, e)} >Añadir tarea</Button>
                    </InputGroup.Append>
                  </InputGroup>
                )}
              </Mutation>
            </Tab>
            <Tab eventKey="tasklist-contributors" disabled={!this.state.userCanEdit} title="Colaboradores">
              <Container className="mb-5">
                <Row className="justify-content-start">
                  <Col xs lg md sm xl="4">
                    <Form.Control ref={this.tasklistContributorInput} placeholder="Nombre de usuario" value={this.state.addContributorTextfield} onChange={(e) => this.setState({addContributorTextfield: e.target.value})}/>
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
                      id="tasklist-read-only"
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
                      id="tasklist-read-write"
                    />
                  </Col>
                  <Col xs lg md sm xl="2">
                    <Dropdown as={ButtonGroup}>
                      <Mutation mutation={ADD_TASKLIST_CONTRIBUTOR_MUTATION}
                        onCompleted={({addTasklistContributor}) => {
                          console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN: ', addTasklistContributor.msg);
                          this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                        }}>
                        {(addTasklistContributor, {data}) => (
                          <Button variant="success" onClick={(e) => this.handleAddContributorButton(addTasklistContributor, e)}>Añadir</Button>
                        )}
                      </Mutation>
                      <Dropdown.Toggle split variant="success" id="dropdown-split-remove-tasklist-contributor" />
                      <Dropdown.Menu>
                        <Mutation mutation={DELETE_TASKLIST_CONTRIBUTOR_MUTATION}
                          onCompleted={({deleteTasklistContributor}) => {
                            console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN DE BORRADO: ', deleteTasklistContributor.msg);
                            this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                          }}>
                          {(deleteTasklistContributor, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleDeleteContributorButton(deleteTasklistContributor, e)}>Eliminar</Dropdown.Item>
                          )}
                        </Mutation>
                        <Mutation mutation={UPDATE_TASKLIST_ACCESS_MUTATION}
                          onCompleted={({updateTasklistAccess}) => {
                            console.log('UPDATE TASKLIST ACCESS: ', updateTasklistAccess.userId, updateTasklistAccess.tasklistId, updateTasklistAccess.canWrite);
                            this.setState({addContributorTextfield: '', onlyReadRadioChecked: false, readWriteRadioChecked: true});
                          }}>
                          {(updateTasklistAccess, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleUpdateTasklistAccessButton(updateTasklistAccess, e)}>Actualizar permisos</Dropdown.Item>
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
                      <Mutation mutation={LINK_TAG_TO_TASKLIST_MUTATION}
                        onCompleted={({tag}) => {
                          console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN: ', tag.id, tag.name);
                          this.props.addTagTasklist({tasklistID: this.props.tasklistID, id: tag.id, name: tag.name});
                          this.setState({addTagTextfield: ''});
                        }}>
                        {(linkTagToTasklist, {data}) => (
                          <Button variant="success" onClick={(e) => this.handleAddTagButton(linkTagToTasklist, e)}>Añadir</Button>
                        )}
                      </Mutation>
                      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                      <Dropdown.Menu>
                        <Mutation mutation={REMOVE_TAG_FROM_TASKLIST_MUTATION}
                          onCompleted={({removeTagFromTasklist}) => {
                            // console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN BORRADO: ', removeTagFromTasklist.msg);
                            this.setState({addTagTextfield: ''});
                          }}>
                          {(removeTagFromTasklist, {data}) => (
                            <Dropdown.Item onClick={(e) => this.handleRemoveTagButton(removeTagFromTasklist, e)}>Eliminar</Dropdown.Item>
                          )}
                        </Mutation>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="tasklist-delete" title="Eliminar lista de tareas">
              <Container className="mb-5">
                <Row className="justify-content-center">
                  <Col xs lg md sm xl="4">
                    <Mutation mutation={DELETE_TASKLIST_MUTATION}
                      onCompleted={({deleteTasklistUser}) => {
                        console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN BORRADO: ', deleteTasklistUser.id, deleteTasklistUser.title);
                      }}>
                      {(deleteTasklistUser, {data}) => (
                        <Button variant='danger' onClick={(e) => this.handleDeleteTasklistButton(deleteTasklistUser, e)}>Eliminar lista de tareas</Button>
                      )}
                    </Mutation>
                  </Col>
                </Row>
              </Container>
            </Tab>
          </Tabs>

          <ListGroup id="tasklist-listgroup" style={{'minHeight': 150, 'maxHeight': 300, 'overflowY': 'auto'}}>
            {/* {
              this.setState({tasklistTextfieldItemRefs:
              this.props.tasklistTasks.map((t) => {
                return ({
                  [t.id]: React.createRef(),
                });
              }).reduce(function(acc, currentVal) {
                return Object.assign(acc, currentVal);
              }),
              })
            }
            {console.log('ESTADO: ', this.state.tasklistTextfieldItemRefs)} */}

            {this.props.tasklistTasks.map((t) => this.tasklistLine(t))}
          </ListGroup>

          <Form.Row className="my-5" style={{'maxHeight': 100, 'overflowY': 'auto'}}>
            {this.props.tasklistTags.map((t) => this.tasklistTag(t))}
            {/* <Badge className="mx-1" pill variant="primary">
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
            </Badge> */}
          </Form.Row>
          <Subscription
            subscription={TASKLIST_TAG_CREATED_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.tasklistTagCreated;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.addTagTasklist({tasklistID: this.props.tasklistID, id: data.id, name: data.name});
                this.setState({state: this.state});
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Subscription
            subscription={TASKLIST_TAG_DELETED_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.tasklistTagDeleted;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.removeTagTasklist({tasklistID: this.props.tasklistID, name: data.msg});
                this.setState({state: this.state});
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Subscription
            subscription={NEW_TASK_IN_TASKLIST_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.newTaskInTasklist;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.addTask({tasklistID: this.props.tasklistID, id: data.id, name: data.name, description: data.description, state: data.state, priority: data.priority, startDatetime: data.startDatetime, endDatetime: data.endDatetime, __typename: 'Task'});
                this.setState({state: this.state});
              } else {
                console.log('SUSCRIPCIÓN OMITIDA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
              }
            }}>
          </Subscription>
          <Subscription
            subscription={DELETED_TASK_IN_TASKLIST_SUBSCRIPTION}
            variables={{tasklistId: this.props.tasklistID}}
            onSubscriptionData={({subscriptionData}) => {
              const data = subscriptionData.data.deletedTaskInTasklist;
              if (data.updatedBy !== this.props.currentUserID) {
                console.log('SUSCRIPCIÓN ACEPTADA PARA USUARIO: ', data.updatedBy, this.props.currentUserID);
                this.props.deleteTask({tasklistID: this.props.tasklistID, id: data.id});
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

export default withRouter(EditTasklist);

