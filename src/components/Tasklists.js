/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col, CardColumns, Card} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import { ACTION_EDIT_BOARD } from '../redux/constants/action-types';
import {Redirect} from 'react-router-dom';

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

  parseTasklistData(tasklistData) {
    return (
      <Card key={tasklistData.id}><Card.Body><Card.Title>{tasklistData.title}</Card.Title></Card.Body></Card>
    );
  }

  render() {
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
