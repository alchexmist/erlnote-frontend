/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col, CardColumns, Card} from 'react-bootstrap';

import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import { ENTITY_VISIBLE_ID_NOTES } from '../redux/constants/action-types';

const GET_OWNER_NOTES = gql`
  {
      me {
        ownerNotes {
          id
          title
          body
        }
      } 
  }
`;

const Notes = ({noteListRequest}) => (
  <Query query={GET_OWNER_NOTES}
    onCompleted={({me}) => {
      console.log('Ala venga chao:', me);
      noteListRequest(me.ownerNotes);
    // client.writeData({ data: { isLoggedIn: true } });
    }}
  >
    {({loading, error, data}) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <ul>
          {
            data.me.ownerNotes.map((noteData) =>
              <Card key={noteData.id}><Card.Body><Card.Title>{noteData.title}</Card.Title><Card.Text>{noteData.body}</Card.Text></Card.Body></Card>
            )
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
);

export default class MainContent extends Component {
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
        { this.props.entityVisible === ENTITY_VISIBLE_ID_NOTES &&
          <Notes noteListRequest={this.props.noteListRequest}/>
        }
        </CardColumns>
        {/* <CardColumns>
          <Card>
            <Card.Img variant="top" src="holder.js/100px160" />
            <Card.Body>
              <Card.Title>Card title that wraps to a new line</Card.Title>
              <Card.Text>
        This is a longer card with supporting text below as a natural lead-in to
        additional content. This content is a little bit longer.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="p-3">
            <blockquote className="blockquote mb-0 card-body">
              <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
        erat a ante.
              </p>
              <footer className="blockquote-footer">
                <small className="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
                </small>
              </footer>
            </blockquote>
          </Card>
          <Card>
            <Card.Img variant="top" src="holder.js/100px160" />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
        This card has supporting text below as a natural lead-in to additional
        content.{' '}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
          <Card bg="primary" text="white" className="text-center p-3">
            <blockquote className="blockquote mb-0 card-body">
              <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
        erat a ante.
              </p>
              <footer className="blockquote-footer">
                <small className="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
                </small>
              </footer>
            </blockquote>
          </Card>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
        This card has supporting text below as a natural lead-in to additional
        content.{' '}
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img src="holder.js/100px160" />
          </Card>
          <Card className="text-right">
            <blockquote className="blockquote mb-0 card-body">
              <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
        erat a ante.
              </p>
              <footer className="blockquote-footer">
                <small className="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
                </small>
              </footer>
            </blockquote>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
        This is a wider card with supporting text below as a natural lead-in to
        additional content. This card has even longer content than the first to
        show that equal height action.
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </CardColumns> */}
      </Container>
    );
  }
}

