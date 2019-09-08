/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, Button, Container, Row, Col, CardColumns, Card} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import { ACTION_EDIT_BOARD } from '../redux/constants/action-types';
import {Redirect} from 'react-router-dom';

const GET_BOARDS = gql`
  {
      me {
        ownerBoards {
          id
          title
          text
        }
        contributorBoards {
          id
          title
          text
        }
      } 
  }
`;

class Boards extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  // componentDidMount() {
  //   <Notes />;
  // }

  handleBoardCardClick(boardID, e) {
    this.props.setUserAction({userActionName: ACTION_EDIT_BOARD, actionEntityID: boardID});
  }

  parseBoardData(boardData) {
    return (
      <Card as="a" key={boardData.id} onClick={(e) => this.handleBoardCardClick(boardData.id, e)} style={{'cursor': 'pointer', 'maxWidth': 400, 'overflowX': 'auto', 'maxHeight': 400, 'overflowY': 'auto'}}><Card.Body><Card.Title>{boardData.title}</Card.Title><Card.Text>{boardData.text}</Card.Text></Card.Body></Card>
    );
  }

  render() {
    if (this.props.userAction === ACTION_EDIT_BOARD) {
      return <Redirect to={'/edit/board/' + this.props.userActionEntityID} />;
    }

    return (
      <Container className="mx-auto my-3">
        <Query query={GET_BOARDS}
          fetchPolicy={'cache-and-network'}
          pollInterval={5000}
          onCompleted={({me}) => {
            if (!(me.ownerBoards.every((e) => this.props.boards.includes(e)))) {
              console.log('OWNER BOARDS RECEIVED: ', me.ownerBoards);
              console.log('OWNER BOARDS STATE: ', this.props.boards);
              this.props.boardListRequest(me.ownerBoards);
            }
            if (!(me.contributorBoards.every((e) => this.props.boards.includes(e)))) {
              console.log('CONTRIBUTOR BOARDS RECEIVED: ', me.contributorBoards);
              console.log('CONTRIBUTOR BOARDS STATE: ', this.props.boards);
              this.props.boardListRequest(me.contributorBoards);
            }
            const allReceivedBoards = me.ownerBoards.concat(me.contributorBoards);
            if (!(this.props.boards.every((e) => allReceivedBoards.includes(e)))) {
              this.props.boardListDeleteRequest(allReceivedBoards);
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
              this.props.boards.map((e) => this.parseBoardData(e))
            }
          </ul>
        </CardColumns>
      </Container>
    );

    // return (
    //   <Container className="mx-auto my-3">
    //     <CardColumns>
    //       <Query query={GET_BOARDS}
    //         fetchPolicy={'cache-and-network'}
    //         onCompleted={({me}) => {
    //           if (!(me.ownerBoards.every((e) => this.props.boards.includes(e)))) {
    //             console.log('OWNER BOARDS RECEIVED: ', me.ownerBoards);
    //             console.log('OWNER BOARDS STATE: ', this.props.boards);
    //             this.props.boardListRequest(me.ownerBoards);
    //           }
    //           if (!(me.contributorBoards.every((e) => this.props.boards.includes(e)))) {
    //             console.log('CONTRIBUTOR BOARDS RECEIVED: ', me.contributorBoards);
    //             console.log('CONTRIBUTOR BOARDS STATE: ', this.props.boards);
    //             this.props.boardListRequest(me.contributorBoards);
    //           }
    //         }}
    //       >
    //         {({loading, error, data}) => {
    //           if (loading) return 'Loading...';
    //           if (error) return `Error! ${error.message}`;

    //           // eslint-disable-next-line react/display-name
    //           const parseBoardData = (boardData) =>
    //             <Card as="a" key={boardData.id} onClick={(e) => this.handleBoardCardClick(boardData.id, e)} style={{cursor: 'pointer'}}><Card.Body><Card.Title>{boardData.title}</Card.Title><Card.Text>{boardData.text}</Card.Text></Card.Body></Card>;

    //           return (
    //             <ul>
    //               {
    //                 data.me.ownerBoards.map(parseBoardData)
    //               }
    //               {
    //                 data.me.contributorBoards.map(parseBoardData)
    //               }
    //             </ul>
    //           );
    //         }}
    //       </Query>
    //     </CardColumns>
    //   </Container>
    // );
  }
}

export default Boards;
