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
            startDatetime
            endDatetime
          }
        }
        contributorTasklists {
          id
          title
          tasks {
            id
            name
            description
            state
            startDatetime
            endDatetime
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

  render() {
    return (
      <Container className="mx-auto my-3">
        <CardColumns>
          <Query query={GET_TASKLISTS}
            fetchPolicy={'cache-and-network'}
            onCompleted={({me}) => {
              this.props.tasklistListRequest(me.ownerTasklists);
              this.props.tasklistListRequest(me.contributorTasklists);
            }}
          >
            {({loading, error, data}) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;

              // eslint-disable-next-line react/display-name
              const parseTasklistData = (tasklistData) =>
                <Card key={tasklistData.id}><Card.Body><Card.Title>{tasklistData.title}</Card.Title></Card.Body></Card>;

              return (
                <ul>
                  {
                    data.me.ownerTasklists.map(parseTasklistData)
                  }
                  {
                    data.me.contributorTasklists.map(parseTasklistData)
                  }
                </ul>
              );
            }}
          </Query>
        </CardColumns>
      </Container>
    );
  }
}

export default Tasklists;
