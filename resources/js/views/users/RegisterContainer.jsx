import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register } from '../../actions/user';
import Register from './Register';

class RegisterContainer extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    validationErrors: {},
    error: null,
    isProcessing: false
  };

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: false, error: null });

    if (!this.validate()) {
      return this.setState({ isProcessing: false });
    }

    const { name, email, password } = this.state;

    try {
      await this.props.register({ name, email, password });
      this.props.history.push('/');
    } catch (error) {
      if (error.response) {
        this.setState({ validationErrors: error.response.data.errors || {} });
      }
      this.setState({ error, isProcessing: false });
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validate() {
    let isValid = true;
    const errors = {};

    const { name, email, password } = this.state;

    if (!name.trim()) {
      errors.name = 'The name field is required.';
      isValid = false;
    } else if (name.length > 255) {
      errors.name = 'The name may not be greater than 255 characters.';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'The email field is required.';
      isValid = false;
    } else if (!this.emailRegex.test(email)) {
      errors.email = 'The email must be a valid email address.';
      isValid = false;
    } else if (email.length > 255) {
      errors.email = 'The email may not be greater than 255 characters.';
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = 'The password field is required.';
      isValid = false;
    } else if (password.length < 8) {
      errors.password = 'The password must be at least 8 characters.';
      isValid = false;
    }

    if (!isValid) {
      this.setState({
        validationErrors: errors,
        error: new Error()
      });
      return false;
    }

    return true;
  }

  render() {
    const {
      name,
      email,
      password,
      validationErrors,
      error,
      isProcessing
    } = this.state;

    return (
      <Register
        name={name}
        email={email}
        password={password}
        validationErrors={validationErrors}
        error={error}
        isProcessing={isProcessing}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

RegisterContainer.propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  register
};

export default connect(
  null,
  mapDispatchToProps
)(RegisterContainer);
