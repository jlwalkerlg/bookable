import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SubmitButton from './SubmitButton';
import { Form } from 'react-bootstrap';
import { logout } from '../actions/user';

class UserDeleteAccountForm extends Component {
  state = {
    isProcessing: false
  };

  source = axios.CancelToken.source();

  componentWillUnmount() {
    this.source.cancel();
  }

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    if (!confirm('Are you sure you wish to delete your account?')) return;

    this.setState({ isProcessing: true });

    const { user } = this.props;

    try {
      await axios.delete(`/api/users/${user.id}`, {
        cancelToken: this.source.token
      });

      this.props.logout();

      alert('Your account has been deleted!');
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
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
        <SubmitButton variant="outline-danger" isLoading={isProcessing}>
          Delete Account
        </SubmitButton>
      </Form>
    );
  }
}

UserDeleteAccountForm.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  className: PropTypes.string
};

const mapDispatchToProps = {
  logout
};

export default connect(
  null,
  mapDispatchToProps
)(UserDeleteAccountForm);
