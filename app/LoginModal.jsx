import React from 'react';
import { Alert, Col, Modal, FormGroup, FormControl, Button } from 'react-bootstrap';

function parseError(message) {
  try {
    return JSON.parse(message).map(error => ({ message: error.detail }));
  } catch (e) {
    return message;
  }
}

export default class LoginModal extends React.Component {

  static contextTypes = {
    fetcher: React.PropTypes.func.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    setToken: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = {
      errors: []
    };
  }

  handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  renderErrors() {
    return this.state.errors.map((err, i) => {
      return <Alert key={i} bsStyle="danger">{err.message}</Alert>;
    });
  }

  checkErrors() {
    this.setState({ errors: [] });
    const errors = [];
    if (!this.state.email) {
      errors.push({ message: 'Email cannot be blank' });
    }
    if (!this.state.password) {
      errors.push({ message: 'Password cannot be blank' });
    }
    if (errors.length) {
      this.setState({ errors });
      return;
    }
  }

  submitLogin(e) {
    e.preventDefault();
    this.checkErrors();
    this.context.fetcher({
      query: `
        mutation Login($input: createSessionInput!){
          createSession(input: $input){
            createdSession {
              token
            }
          }
        }
      `,
      variables: {
        input: {
          clientMutationId: Number(new Date()),
          attributes: {
            email: this.state.email,
            password: this.state.password
          }
        }
      }
    }).then(({ data, errors }) => {
      if (errors) {
        const messages = errors.reduce(
          (errs, { message }) => errs.concat(
            { message: parseError(message) }
          ), []
        );
        this.setState({ errors: messages });
        return;
      }
      this.context.setToken(data.createSession.createdSession.token);
      this.context.closeModal();
    });
  }

  requiredFieldClass(field) {
    if (this.state.errors.length && !this.state[field]) {
      return 'error';
    }
  }

  getValidationState() {
    if (this.state.errors.length) {
      return 'error';
    }
  }

  render() {
    return (
      <Modal show={true}>
        <Modal.Header style={{ textAlign: 'center' }}>
          <h2>Login to Brandfolder</h2>
        </Modal.Header>
        <form>
          <Modal.Body>
            {this.renderErrors()}
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <FormControl
                bsSize="large" type="text" name="email"
                placeholder="Email"
                bsStyle={this.requiredFieldClass('email')}
                onChange={this.handleChange.bind(this)} />
            </FormGroup>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <FormControl
                bsSize="large" type="password" name="password"
                placeholder="Password"
                bsStyle={this.requiredFieldClass('password')}
                onChange={this.handleChange.bind(this)} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Col xs={6}>
              <Button
                block
                bsSize="large"
                type="button"
                onClick={this.context.closeModal}
              >Cancel</Button>
            </Col>
            <Col xs={6}>
              <Button
                block
                bsSize="large"
                bsStyle="primary"
                type="submit"
                onClick={this.submitLogin.bind(this)}
              >Submit</Button>
            </Col>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

}
