/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Button, Form} from 'react-bootstrap';
// import LoadMainBar from '../containers/LoadMainBar';
// import LoadMainContent from '../containers/LoadMainContent';
import {withRouter} from 'react-router-dom';

class EditBoard extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  render() {
    //   {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
    //   <Form.Label>{this.props.match.params.id}</Form.Label>
    return (
      <Container>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
                {/* EL IDENTIFICADOR DEL TABLERO DE LA URL */}
              <Form.Label>{this.props.match.params.id}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="1234 Main St" />
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select">
                <option>Choose...</option>
                <option>...</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>

          <Button variant="primary" type="submit">
    Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default withRouter(EditBoard);
