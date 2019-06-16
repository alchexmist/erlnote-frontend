import React, { Component } from 'react';
import { Button, Form, Nav, Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Login extends Component {
  constructor(props) {
      super(props);

      this.state = {
          email: "",
          password: ""
      };

  }

  render() {
    let style = { loginLabel: {color: "white", 'background-color': "rgb(53, 58, 63)"}};
    return (
      <Container className="d-flex flex-column justify-content-between h-100" fluid="true">
        <Row className="d-flex flex-column">
          <Navbar bg="dark" variant="dark" >
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Form inline>
              <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar>
        </Row>
        <Row>
          <Col className="d-flex flex-row justify-content-center">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label bsStyle="default" style={style.loginLabel}>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="Introduzca su dirección de correo" />
                <Form.Text className="text-muted">
                  Nunca compartiremos tu dirección de correo electrónico con nadie.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" >
                <Form.Label bsStyle="default" style={style.loginLabel}>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Confirmar
              </Button>
              <Button bsStyle="default" style={{color:"red", 'background-color': "green"}}>
                Reset
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="d-flex flex-column">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              {' React Bootstrap'}
            </Navbar.Brand>
          </Navbar>
        </Row>
      </Container>
    ); // End return-render
  }

}