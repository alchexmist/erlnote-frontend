/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col, CardColumns, Card} from 'react-bootstrap';
import LoadBoards from '../containers/LoadBoards';
import LoadTasklists from '../containers/LoadTasklists';
import Notes from '../containers/LoadNotes';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {ENTITY_VISIBLE_ID_NOTES, ENTITY_VISIBLE_ID_BOARDS, ENTITY_VISIBLE_ID_TASKLISTS} from '../redux/constants/action-types';

// const GET_NOTES = gql`
//   {
//       me {
//         ownerNotes {
//           id
//           title
//           body
//         }
//         contributorNotes {
//           id
//           title
//           body
//         }
//       } 
//   }
// `;

// const GET_BOARDS = gql`
//   {
//       me {
//         ownerBoards {
//           id
//           title
//           text
//         }
//         contributorBoards {
//           id
//           title
//           text
//         }
//       } 
//   }
// `;

// const GET_TASKLISTS = gql`
//   {
//       me {
//         ownerTasklists {
//           id
//           title
//           tasks {
//             id
//             name
//             description
//             state
//             startDatetime
//             endDatetime
//           }
//         }
//         contributorTasklists {
//           id
//           title
//           tasks {
//             id
//             name
//             description
//             state
//             startDatetime
//             endDatetime
//           }
//         }
//       } 
//   }
// `;

// const Notes = ({noteListRequest}) => (
//   <Query query={GET_NOTES}
//     fetchPolicy={'cache-and-network'}
//     onCompleted={({me}) => {
//       console.log('Ala venga chao:', me);
//       noteListRequest(me.ownerNotes);
//       noteListRequest(me.contributorNotes);
//     // client.writeData({ data: { isLoggedIn: true } });
//     }}
//   >
//     {({loading, error, data}) => {
//       if (loading) return 'Loading...';
//       if (error) return `Error! ${error.message}`;

//       // eslint-disable-next-line react/display-name
//       const parseNoteData = (noteData) =>
//         <Card key={noteData.id}><Card.Body><Card.Title>{noteData.title}</Card.Title><Card.Text>{noteData.body}</Card.Text></Card.Body></Card>;

//       return (
//         <ul>
//           {
//             data.me.ownerNotes.map(parseNoteData)
//           }
//           {
//             data.me.contributorNotes.map(parseNoteData)
//           }
//         </ul>
//       // <select name="dog" onChange={onDogSelected}>
//       //   {data.dogs.map(dog => (
//       //     <option key={dog.id} value={dog.breed}>
//       //       {dog.breed}
//       //     </option>
//       //   ))}
//       // </select>
//       );
//     }}
//   </Query>
// );

// const Boards = ({boardListRequest}) => (
//   <Query query={GET_BOARDS}
//     onCompleted={({me}) => {
//       boardListRequest(me.ownerBoards);
//       boardListRequest(me.contributorBoards);
//     }}
//   >
//     {({loading, error, data}) => {
//       if (loading) return 'Loading...';
//       if (error) return `Error! ${error.message}`;

//       // eslint-disable-next-line react/display-name
//       const parseBoardData = (boardData) =>
//         <Card key={boardData.id}><Card.Body><Card.Title>{boardData.title}</Card.Title><Card.Text>{boardData.text}</Card.Text></Card.Body></Card>;

//       return (
//         <ul>
//           {
//             data.me.ownerBoards.map(parseBoardData)
//           }
//           {
//             data.me.contributorBoards.map(parseBoardData)
//           }
//         </ul>
//       );
//     }}
//   </Query>
// );

// const Tasklists = ({tasklistListRequest}) => (
//   <Query query={GET_TASKLISTS}
//     fetchPolicy={'cache-and-network'}
//     onCompleted={({me}) => {
//       tasklistListRequest(me.ownerTasklists);
//       tasklistListRequest(me.contributorTasklists);
//     // client.writeData({ data: { isLoggedIn: true } });
//     }}
//   >
//     {({loading, error, data}) => {
//       if (loading) return 'Loading...';
//       if (error) return `Error! ${error.message}`;

//       // eslint-disable-next-line react/display-name
//       const parseTasklistData = (tasklistData) =>
//         <Card key={tasklistData.id}><Card.Body><Card.Title>{tasklistData.title}</Card.Title></Card.Body></Card>;

//       return (
//         <ul>
//           {
//             data.me.ownerTasklists.map(parseTasklistData)
//           }
//           {
//             data.me.contributorTasklists.map(parseTasklistData)
//           }
//         </ul>
//       );
//     }}
//   </Query>
// );

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
          <Notes />
          }
          { this.props.entityVisible === ENTITY_VISIBLE_ID_BOARDS &&
          <LoadBoards />
          }
          { this.props.entityVisible === ENTITY_VISIBLE_ID_TASKLISTS &&
          <LoadTasklists />
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

