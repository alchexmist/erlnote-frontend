/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
// import LoadMainBar from '../containers/LoadMainBar';
// import LoadMainContent from '../containers/LoadMainContent';

class SignUp extends Component {
  constructor(props) {
    super(props);

    // this.state = {

    // };
  }

  render() {
    return (
    //   <Container className="d-flex flex-column mb-auto p-0" fluid>
      <Container className="" fluid>
        <Form>
          <Form.Group as={Col} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 3 }} controlId="formGridName">
            <Form.Label>Nombre y Apellidos</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="signup-nombre">Nombre y Apellidos</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control placeholder="Introduce tu nombre y apellidos" />
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 3 }} controlId="formGridUserName">
            <Form.Label>Nombre de usuario</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="signup-usuario">Nombre de usuario</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control placeholder="Introduce un nombre de usuario" />
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 3 }} controlId="formSigUpEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="signup-arroba">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="email" placeholder="Introduce la dirección de correo electrónico" />
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 3 }} controlId="formSignUpPassword">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="signup-asterisco">**</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="password" placeholder="Contraseña" />
            </InputGroup>
          </Form.Group>

          <Form.Group as={Row} className="justify-content-md-center"  controlId="formSignUpButton">
            <Button variant="primary" className="mr-1" type="submit">
                Enviar registro
            </Button>
            <Button variant="danger" className="ml-1" type="reset">
                Restablecer
            </Button>
            </Form.Group>
        </Form>

        {/* <Row className="m-0">
          <LoadMainBar />
        </Row>
        <Row className="ml-0 mr-0">
          <LoadMainContent />
        </Row> */}
      </Container>
    );
  }
}

export default SignUp;
