/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, ListGroup, Button, Container, Row, Col, CardColumns, Card, Badge} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {ACTION_EDIT_TASKLIST} from '../redux/constants/action-types';
import {Redirect} from 'react-router-dom';

const TASK_STATE_FINISHED = 'FINISHED';
const TASK_PRIORITY_LOW = 'LOW';
const TASK_PRIORITY_NORMAL = 'NORMAL';
const TASK_PRIORITY_HIGH = 'HIGH';

const GET_TASKLISTS = gql`
  {
      me {
        ownerTasklists {
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
        contributorTasklists {
          id
          title
          tasks {
            id
            name
            description
            priority
            state
            startDatetime
            endDatetime
          }
          tags {
            id
            name
          }
        }
      } 
  }
`;

class Tasklists extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  handleTasklistCardClick(tasklistID, e) {
    this.props.setUserAction({userActionName: ACTION_EDIT_TASKLIST, actionEntityID: tasklistID});
  }

  parseTaskData(taskData) {
    const style = {};
    if (taskData.state === TASK_STATE_FINISHED) {
      style['textDecoration'] = 'line-through';
    } else {
      style['textDecoration'] = 'initial';
    }

    switch (taskData.priority) {
      case TASK_PRIORITY_HIGH:
        style['color'] = 'red';
        break;
      case TASK_PRIORITY_LOW:
        style['color'] = 'green';
        break;
      default:
        break;
    }

    return (
      <ListGroup.Item key={taskData.id} style={style}>{taskData.name}</ListGroup.Item>
    );
  }

  parseTagData(tagData) {
    return (
      <Badge key={tagData.id} className="mr-1" pill variant="primary">{tagData.name}</Badge>
    );
  }

  parseTasklistData(tasklistData) {
    return (
      <Card as="a" key={tasklistData.id} style={{'cursor': 'pointer', 'maxWidth': 400, 'overflowX': 'auto', 'maxHeight': 400, 'overflowY': 'auto'}} onClick={(e) => this.handleTasklistCardClick(tasklistData.id, e)} >
        <Card.Body>
          <Card.Title>{tasklistData.title}</Card.Title>
          <ListGroup variant="flush">
            {tasklistData.tasks.map((t) => this.parseTaskData(t))}
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          {tasklistData.tags.map((t) => this.parseTagData(t))}
        </Card.Footer>
      </Card>
    );
  }

  render() {
    if (this.props.userAction === ACTION_EDIT_TASKLIST) {
      return <Redirect push to={'/edit/tasklist/' + this.props.userActionEntityID} />;
    }

    return (
      <Container className="mx-auto my-3">
        <Query query={GET_TASKLISTS}
          fetchPolicy={'cache-and-network'}
          pollInterval={5000}
          onCompleted={({me}) => {
            if (!(me.ownerTasklists.every((e) => this.props.tasklists.includes(e)))) {
              this.props.tasklistListRequest(me.ownerTasklists);
            }
            if (!(me.contributorTasklists.every((e) => this.props.tasklists.includes(e)))) {
              this.props.tasklistListRequest(me.contributorTasklists);
            }
            const allReceivedTasklists = me.ownerTasklists.concat(me.contributorTasklists);
            if (!(this.props.tasklists.every((e) => allReceivedTasklists.includes(e)))) {
              this.props.tasklistListDeleteRequest(allReceivedTasklists);
            }
          }}
        >
          {({loading, error, data}) => {
            if (loading) return null;
            if (error) return null;

            return null;
          }}
        </Query>
        <CardColumns>
          <ul>
            {
              this.props.tasklists.map((e) => this.parseTasklistData(e))
            }
          </ul>
        </CardColumns>
      </Container>
    );
  }
}

export default Tasklists;
