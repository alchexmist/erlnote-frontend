/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col, CardColumns, Card} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import { ACTION_EDIT_BOARD } from '../redux/constants/action-types';
import {Redirect} from 'react-router-dom';

const GET_NOTES = gql`
  {
      me {
        ownerNotes {
          id
          title
          body
        }
        contributorNotes {
          id
          title
          body
        }
      } 
  }
`;

class Notes extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  // componentDidMount() {
  //   <Notes />;
  // }

  parseNoteData(noteData) {
    return (
      <Card key={noteData.id}><Card.Body><Card.Title>{noteData.title}</Card.Title><Card.Text>{noteData.body}</Card.Text></Card.Body></Card>
    );
  }

  render() {
    return (
      <Container className="mx-auto my-3">
        <Query query={GET_NOTES}
          fetchPolicy={'cache-and-network'}
          pollInterval={5000}
          onCompleted={({me}) => {
            if (!(me.ownerNotes.every((e) => this.props.notes.includes(e)))) {
              this.props.noteListRequest(me.ownerNotes);
            }
            if (!(me.contributorNotes.every((e) => this.props.notes.includes(e)))) {
              this.props.noteListRequest(me.contributorNotes);
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
              this.props.notes.map((e) => this.parseNoteData(e))
            }
          </ul>
        </CardColumns>
      </Container>
    );
  }
}

export default Notes;
