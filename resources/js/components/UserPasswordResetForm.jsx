import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import SubmitButton from './SubmitButton';
import { addNotification } from '../actions/notifications';

class UserPasswordResetForm extends Component {
  state = {
    isProcessing: false
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    if (!confirm('Are you sure you wish to request a password reset?')) return;

    this.setState({ isProcessing: true });

    const { user } = this.props;

    try {
      await axios.post(`/api/passwords/reset`, {
        email: user.email
      });

      this.props.addNotification('An email has been sent to your account.');
    } catch (error) {
      this.props.addNotification(`Something went wrong: ${error.message}.`);
    }

    this.setState({ isProcessing: false });
  };

  render() {
    const { isProcessing } = this.state;

    return (
      <Form
        action=""
        method="POST"
        onSubmit={this.handleSubmit}
        className={this.props.className}
      >
        <SubmitButton variant="outline-secondary" isLoading={isProcessing}>
          Reset password
        </SubmitButton>
      </Form>
    );
  }
}

UserPasswordResetForm.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  addNotification
};

export default connect(
  null,
  mapDispatchToProps
)(UserPasswordResetForm);
