import React from 'react';
import { Modal } from 'react-bootstrap';

export default class LoginModal extends React.Component {

  static contextTypes = {
    fetcher: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <Modal {...this.props}>
        <Modal.Header>
          <h2>Login to Brandfolder</h2>
        </Modal.Header>
        <Modal.Body>The Login Form</Modal.Body>
      </Modal>
    );
  }

}
