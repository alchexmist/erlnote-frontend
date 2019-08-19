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

  render() {
    return (
      <Container className="mx-auto my-3">
        <CardColumns>
          <Query query={GET_NOTES}
            fetchPolicy={'cache-and-network'}
            onCompleted={({me}) => {
              this.props.noteListRequest(me.ownerNotes);
              this.props.noteListRequest(me.contributorNotes);
            }}
          >
            {({loading, error, data}) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;

              // eslint-disable-next-line react/display-name
              const parseNoteData = (noteData) =>
                <Card key={noteData.id}><Card.Body><Card.Title>{noteData.title}</Card.Title><Card.Text>{noteData.body}</Card.Text></Card.Body></Card>;

              return (
                <ul>
                  {
                    data.me.ownerNotes.map(parseNoteData)
                  }
                  {
                    data.me.contributorNotes.map(parseNoteData)
                  }
                </ul>
              // <select name="dog" onChange={onDogSelected}>
              //   {data.dogs.map(dog => (
              //     <option key={dog.id} value={dog.breed}>
              //       {dog.breed}
              //     </option>
              //   ))}
              // </select>
              );
            }}
          </Query>
        </CardColumns>
      </Container>
    );
  }
}

export default Notes;
