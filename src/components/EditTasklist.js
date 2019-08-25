/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Row, Tabs, Tab} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Subscription} from 'react-apollo';

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
      tasklistTextfieldItemRefs: {},
    };

    // Referencia (Ref) a entrada de título
    this.tasklistTitleInput = React.createRef();
    this.newTaskTextField = React.createRef();

    this.moreMutations = false;
  }

  componentDidMount() {
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
    let newTitle;
    let withTitle = true;

    if (e.target.value.length > 0) {
      newTitle = fixAccentMark(e.target.value);
    } else {
      newTitle = '<Sin título>';
      withTitle = false;
    }
    // const newTitle = fixAccentMark(e.target.value);
    const cursorStart = e.target.selectionStart;

    this.setMoreMutations();

    this.tasklistTitleInput.current.value = newTitle;
    if (withTitle) {
      this.tasklistTitleInput.current.selectionStart = this.tasklistTitleInput.current.selectionEnd = cursorStart;
    } else {
      this.tasklistTitleInput.current.selectionStart = cursorStart;
      this.tasklistTitleInput.current.selectionEnd = newTitle.length;
    }
    this.setState({titleCursorOffset: cursorStart});

    updateTasklist({variables: {tasklistData: {
      'tasklistId': this.props.tasklistID,
      'title': newTitle,
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

  tasklistLine(t) {
    return (
      <ListGroup.Item key={t.id} as="div" variant="dark">
        <InputGroup>
          <InputGroup.Prepend>
            <Mutation mutation={UPDATE_TASK_IN_TASKLIST_MUTATION}
              onCompleted={({task}) => {
                this.props.updateTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
                console.log('ESTADO DE LA TAREA RESULTADO DE MUTACIÓN: ', task.state);
              }}>
              {(updateTaskInTasklist, {data}) => (
                <InputGroup.Checkbox key={t.id} aria-label="Marcar tarea como finalizada" checked={(t.state === TASK_STATE_FINISHED) ? true : false} onChange={(e) => this.handleFinishedTaskCheckbox(updateTaskInTasklist, t, e)} />
              )}
            </Mutation>
          </InputGroup.Prepend>
          <Form.Control className="mx-1" plaintext aria-label={t.name} key={t.id} style={(t.state === TASK_STATE_FINISHED) ? {'textDecoration': 'line-through'} : {'textDecoration': 'initial'}} defaultValue={t.name} />
          <InputGroup.Append>
            <DropdownButton
              variant={(t.priority === TASK_PRIORITY_NORMAL) ? "warning" : ((t.priority === TASK_PRIORITY_HIGH) ? "danger" : "success")}
              title={(t.priority === TASK_PRIORITY_NORMAL) ? "Prioridad normal" : ((t.priority === TASK_PRIORITY_HIGH) ? "Prioridad alta" : "Prioridad baja")}
              id="input-group-dropdown-2"
              className="mr-1"
            >
              <Dropdown.Item >Prioridad baja</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item >Prioridad alta</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item >Prioridad normal</Dropdown.Item>
              
            </DropdownButton>
            <Button variant="primary" className="mr-1">Editar</Button>
            <Button variant="danger">Eliminar</Button>
          </InputGroup.Append>
        </InputGroup>
      </ListGroup.Item>
    );
  }

  render() {
    //   {/* EL IDENTIFICADOR DE LA LISTA DE TAREAS DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
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
                <Form.Control ref={this.tasklistTitleInput} size="lg" type="text" placeholder="Título de la lista de tareas" defaultValue={(this.props.tasklistTitle !== null) ? this.props.tasklistTitle : ''} onChange={(e) => this.handleTitleChange(updateTasklist, e)} onClick={(e) => this.setState({titleCursorOffset: e.target.selectionStart})}/>
              </InputGroup>
            )}
          </Mutation>
          <Tabs id="uncontrolled-tab-tasklist-actions" className="mt-5 mb-3" variant="pills">
            <Tab eventKey="tasklist-new-task" title="Nueva Tarea">
              <Mutation mutation={ADD_TASK_TO_TASKLIST_MUTATION}
                onCompleted={({task}) => {
                  this.props.addTask({tasklistID: this.props.tasklistID, id: task.id, name: task.name, description: task.description, state: task.state, priority: task.priority, startDatetime: task.startDatetime, endDatetime: task.endDatetime, __typename: 'Task'});
                  this.setState({newTaskName: ''});
                  this.newTaskTextField.current.focus();
                }}>
                {(addTaskToTasklist, {data}) => (
                  <InputGroup className="mb-5">
                    <Form.Control ref={this.newTaskTextField} placeholder="Nombre de la tarea nueva a crear" aria-label="Nombre de la tarea nueva a crear" type="text" value={this.state.newTaskName} onChange={(e) => this.setState({newTaskName: e.target.value})} />
                    <InputGroup.Append>
                      <Button variant="success" onClick={(e) => this.handleAddTaskButton(addTaskToTasklist, e)} >Añadir tarea</Button>
                    </InputGroup.Append>
                  </InputGroup>
                )}
              </Mutation>
            </Tab>
            <Tab eventKey="tasklist-contributors" title="Colaboradores">
              <Container className="mb-5">
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
              </Container>
            </Tab>
            <Tab eventKey="contact" title="Etiquetas">
              <Container className="mb-5">
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

