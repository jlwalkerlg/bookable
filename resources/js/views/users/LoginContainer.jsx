import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/user';
import Login from './Login';

class LoginContainer extends Component {
  state = {
    email: '',
    password: '',
    isProcessing: false,
    error: null
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true, error: null });

    const { email, password } = this.state;

    try {
      await this.props.login({ email, password });
      this.props.history.push('/');
    } catch (error) {
      this.setState({ error, isProcessing: false });
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, error, isProcessing } = this.state;

    return (
      <Login
        email={email}
        password={password}
        error={error}
        isProcessing={isProcessing}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

LoginContainer.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  login
};

export default connect(
  null,
  mapDispatchToProps
)(LoginContainer);
