import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { login } from '../actions/user';

class Login extends Component {
  state = {
    values: {
      email: '',
      password: ''
    },
    error: null
  };

  login = e => {
    e.preventDefault();

    this.props
      .login(this.state.values)
      .then(user => this.handleLoginSuccess(user))
      .catch(error => this.handleLoginError(error.response));
  };

  handleChange = e => {
    this.setState({
      values: { ...this.state.values, [e.target.name]: e.target.value }
    });
  };

  handleLoginSuccess = user => {
    this.props.history.push('/');
  };

  handleLoginError = error => {
    this.setState({ error: error.data.message });
  };

  render() {
    const { values, error } = this.state;

    return (
      <main className="bg-beige">
        <Container className="section container-narrow min-vh-100-nav d-flex justify-content-center flex-column">
          {error && (
            <Alert variant="danger">
              There was an issue with the login attempt.
            </Alert>
          )}
          <h1>Login</h1>
          <Form action="/login" method="POST" onSubmit={this.login}>
            {/* Email */}
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Your email here..."
                required
                value={values.email}
                onChange={this.handleChange}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Your password here..."
                required
                value={values.password}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Button type="submit">Login</Button>
          </Form>
        </Container>
      </main>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  login
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Login)
);
