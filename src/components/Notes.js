/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Badge, Container, CardColumns, Card} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import {ACTION_EDIT_NOTE} from '../redux/constants/action-types';

const GET_NOTES = gql`
  {
      me {
        ownerNotes {
          id
          title
          body
          tags {
            id
            name
          }
        }
        contributorNotes {
          id
          title
          body
          tags {
            id
            name
          } 
        }
      } 
  }
`;

class Notes extends Component {
  constructor(props) {
    super(props);
  }

  handleNoteCardClick(noteID, e) {
    this.props.setUserAction({userActionName: ACTION_EDIT_NOTE, actionEntityID: noteID});
  }

  parseTagData(tagData) {
    return (
      <Badge key={tagData.id} className="mr-1" pill variant="primary">{tagData.name}</Badge>
    );
  }

  parseNoteData(noteData) {
    return (
      <Card key={noteData.id} style={{'cursor': 'pointer', 'maxWidth': 400, 'overflowX': 'auto', 'maxHeight': 400, 'overflowY': 'auto'}} onClick={(e) => this.handleNoteCardClick(noteData.id, e)} >
        <Card.Body>
          <Card.Title>{noteData.title}</Card.Title>
          <Card.Text>{noteData.body}</Card.Text>
        </Card.Body>
        <Card.Footer>
          {noteData.tags.map((t) => this.parseTagData(t))}
        </Card.Footer>
      </Card>
    );
  }

  render() {
    if (this.props.userAction === ACTION_EDIT_NOTE) {
      return <Redirect push to={'/edit/note/' + this.props.userActionEntityID} />;
    }

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
