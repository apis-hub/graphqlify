import React from 'react';
import { Alert, Col, Modal, Input, ButtonInput } from 'react-bootstrap';

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

  submitLogin(e) {
    e.preventDefault();
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
            JSON.parse(message).map(error => ({ message: error.detail }))
          ), []
        )
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

  render() {
    return (
      <Modal show={true}>
        <Modal.Header style={{ textAlign: 'center' }}>
          <h2>Login to Brandfolder</h2>
        </Modal.Header>
        <form>
          <Modal.Body>
            {this.renderErrors()}
            <Input bsSize="large" type="text" name="email"
              bsStyle={this.requiredFieldClass('email')}
              label="Email" onChange={this.handleChange.bind(this)} />
            <Input bsSize="large" type="password" name="password"
              bsStyle={this.requiredFieldClass('password')}
              label="Password" onChange={this.handleChange.bind(this)} />
          </Modal.Body>
          <Modal.Footer>
            <Col xs={6}>
              <ButtonInput
                block
                bsSize="large"
                type="button"
                value="Cancel"
                onClick={this.context.closeModal}
              />
            </Col>
            <Col xs={6}>
              <ButtonInput
                block
                bsSize="large"
                bsStyle="primary"
                type="submit"
                value="Submit"
                onClick={this.submitLogin.bind(this)}
              />
            </Col>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

}
