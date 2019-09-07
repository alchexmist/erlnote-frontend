/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Col, Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Row, Tabs, Tab} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {ACTION_NONE} from '../redux/constants/action-types';

import gql from 'graphql-tag';
import {Mutation, Query, Subscription} from 'react-apollo';

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

const GET_NOTE_ACCESS_INFO_QUERY = gql`
  query GetAccessInfo($entityId: ID!) {
    getAccessInfo(entityId: $entityId, entityType: NOTE) {
      ... on NoteAccessInfo {
        ownerId
        userId
        canRead
        canWrite
        noteId
      }
    }
  }`;

class EditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
    //   titleCursorOffset: 0,
    //   newTaskName: '',
    //   addTagTextfield: '',
    //   addContributorTextfield: '',
    //   readWriteRadioChecked: true,
    //   onlyReadRadioChecked: false,
      userCanEdit: true,
    };

    // Referencia (Ref) a entrada de título
    this.noteTitleInput = React.createRef();
    // this.newTaskTextField = React.createRef();
    // this.addTagButton = React.createRef();
    // this.tasklistContributorInput = React.createRef();

    this.moreMutations = false;
  }

  componentDidMount() {
    // document.getElementById('root').scrollTop = 0;
    this.props.setUserAction({userActionName: ACTION_NONE, actionEntityID: this.props.match.params.id});
    // this.tasklistTitleInput.current.focus();
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

  render() {
    //   {/* EL IDENTIFICADOR DE LA NOTA DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container className="my-3">
        <Form>
        <Query query={GET_NOTE_ACCESS_INFO_QUERY}
            variables={{entityId: this.props.match.params.id}}
            fetchPolicy={'cache-and-network'}
            onCompleted={({getAccessInfo}) => {
              console.log('QUERY RESULT: ', getAccessInfo.canWrite);
              this.setState({userCanEdit: getAccessInfo.canWrite});
            }}
          >
            {({loading, error, data}) => {
              if (loading) return null;
              if (error) return null;

              return null;
            }}
          </Query>
        <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Título</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control ref={this.noteTitleInput} disabled={!this.state.userCanEdit} size="lg" type="text" placeholder="Título de la nota" defaultValue={(this.props.noteTitle !== null) ? this.props.noteTitle : 'No ha sido posible obtener el título'} />
              </InputGroup>
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditNote);
