/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Alert, Badge, Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

// import LoadMainBar from '../containers/LoadMainBar';
// import LoadMainContent from '../containers/LoadMainContent';

const CREATE_USER_ACCOUNT_MUTATION = gql`
  mutation CreateUserAccount($accountData: UserAccountInput!) {
    userAccount: createUserAccount(input: $accountData) {
      id
      name
      username
      credentials {
        email
        password_hash
      }
    }
  }`;

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signup_ok: false,
      signup_error: false,
      name: '',
      username: '',
      email: '',
      password: '',
    };
  }

  handleNameOnChange(e) {
    this.setState({name: e.target.value});
  }

  handleUserNameOnChange(e) {
    this.setState({username: e.target.value});
  }

  handleEmailOnChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordOnChange(e) {
    this.setState({password: e.target.value});
  }
  handleSignUpButtonOnClick(createUserAccount, e) {
    e.preventDefault();
    createUserAccount({variables: {accountData: {
      'username': this.state.username,
      'name': this.state.name,
      'credentials': [
        {
          'email': this.state.email,
          'password': this.state.password,
        },
      ],
    }}});
  }

  handleResetButtonOnClick(e) {
    this.setState({
      signup_ok: false,
      signup_error: false,
      name: '',
      username: '',
      email: '',
      password: '',
    });
  }

  render() {
    return (
    //   <Container className="d-flex flex-column mb-auto p-0" fluid>
      <Container className="" fluid>
        <Mutation mutation={CREATE_USER_ACCOUNT_MUTATION}
          onCompleted={({userAccount}) => {
            console.log('Account ID: ', userAccount.id);
            console.log('Account Name: ', userAccount.name);
            console.log('Account UserName: ', userAccount.username);
            console.log('Account Email: ', userAccount.credentials[0].email);
            console.log('Account Password: ', userAccount.credentials[0].password_hash);
            this.setState({
              signup_ok: true,
              name: '',
              username: '',
              email: '',
              password: '',
            });
          }}
          onError={({message}) => {
            console.log('Error durante la creación de la cuenta!', message);
            this.setState({signup_error: true});
          }}>
          {(createUserAccount, {data}) => (
            <Form onSubmit={(e) => this.handleSignUpButtonOnClick(createUserAccount, e)}>
              <Form.Group as={Row} className="justify-content-md-center" controlId="formSignUpAlert">
                {this.state.signup_ok &&
            <Alert variant="success">
              <Alert.Heading>Registro realizado con éxito</Alert.Heading>
              <p>¡Bienvenido a erlNote!. Esperamos que disfrutes de la experiencia.</p>
              <hr />
              <p className="mb-0">@alchexmist Team</p>
            </Alert>}
                {this.state.signup_error &&
            <Alert variant="danger">
              <Alert.Heading>Error durante el proceso de registro</Alert.Heading>
              <p>¡Lo sentimos!. Ha habido un error durante el proceso de registro. Revisa tus datos e inténtalo de nuevo.</p>
              <hr />
              <p className="mb-0">@alchexmist Team</p>
            </Alert>}
              </Form.Group>
              <Form.Group as={Col} lg={{span: 6, offset: 3}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xl={{span: 6, offset: 3}} xs={{span: 6, offset: 3}} controlId="formGridName">
                <Form.Label>Nombre y Apellidos</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="ig-signup-name">Nombre y Apellidos</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control required value={this.state.name} onChange={(e) => this.handleNameOnChange(e)} placeholder="Introduce tu nombre y apellidos" />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} lg={{span: 6, offset: 3}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xl={{span: 6, offset: 3}} xs={{span: 6, offset: 3}} controlId="formGridUserName">
                <Form.Label>Nombre de usuario</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="ig-signup-username">Nombre de usuario</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control required value={this.state.username} onChange={(e) => this.handleUserNameOnChange(e)} placeholder="Introduce un nombre de usuario" />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} lg={{span: 6, offset: 3}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xl={{span: 6, offset: 3}} xs={{span: 6, offset: 3}} controlId="formSigUpEmail">
                <Form.Label>Correo electrónico <Badge variant="info">(Ejemplo: usuario@example.com)</Badge></Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="ig-signup-email">@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control required value={this.state.email} onChange={(e) => this.handleEmailOnChange(e)} type="email" autoComplete="email" placeholder="Introduce la dirección de correo electrónico" />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} lg={{span: 6, offset: 3}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xl={{span: 6, offset: 3}} xs={{span: 6, offset: 3}} controlId="formSignUpPassword">
                <Form.Label>Contraseña <Badge variant="info">(Longitud mínima: 8 caracteres)</Badge></Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="ig-signup-password">**</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control required value={this.state.password} onChange={(e) => this.handlePasswordOnChange(e)} type="password" autoComplete="current-password" placeholder="Contraseña" />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Row} className="justify-content-md-center" controlId="formSignUpButton">
                {/* <Button variant="primary" className="mr-1" type="submit" onClick={(e) => this.handleSignUpButtonOnClick(e)}> */}
                <Button variant="primary" className="mr-1" type="submit">
                Enviar registro
                </Button>
                <Button variant="danger" className="ml-1" type="reset" onClick={(e) => this.handleResetButtonOnClick(e)}>
                Restablecer
                </Button>
              </Form.Group>
            </Form>
          )}
        </Mutation>
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
