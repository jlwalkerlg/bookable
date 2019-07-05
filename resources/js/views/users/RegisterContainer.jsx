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

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: false, error: null });

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
