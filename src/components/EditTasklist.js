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
          <Form.Control ref={(input) => {this[`taskTextfieldItemRef${t.id}`] = input;}} className="mx-1" plaintext aria-label={t.name} key={t.id} style={(t.state === TASK_STATE_FINISHED) ? {'textDecoration': 'line-through'} : {'textDecoration': 'initial'}} defaultValue={t.name} />
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
                >
                  <Dropdown.Item eventKey={TASK_PRIORITY_LOW} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad baja</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey={TASK_PRIORITY_HIGH} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad alta</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey={TASK_PRIORITY_NORMAL} onSelect={(eventKey, e) => this.handlePriorityDropdown(t, updateTaskInTasklist, eventKey, e)}>Prioridad normal</Dropdown.Item>
                </DropdownButton>
              )}
            </Mutation>
            <Button variant="primary" className="mr-1" onClick={(e) => this.handleTaskEditButton(t.id, e)}>Editar</Button>
            <Button variant="danger">Eliminar</Button>
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
                            console.log('ESTADO DE LA ETIQUETA RESULTADO DE MUTACIÓN BORRADO: ', removeTagFromTasklist.msg);
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
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditTasklist);

