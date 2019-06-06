import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { register } from '../actions/user';

class Register extends Component {
  state = {
    values: {
      name: '',
      email: '',
      password: ''
    },
    errors: {}
  };

  register = e => {
    e.preventDefault();

    this.props
      .register(this.state.values)
      .then(user => this.handleRegisterSuccess(user))
      .catch(error => this.handleRegisterError(error.response));
  };

  handleChange = e => {
    this.setState({
      values: { ...this.state.values, [e.target.name]: e.target.value },
      errors: { ...this.state.errors, [e.target.name]: null }
    });
  };

  handleRegisterSuccess = user => {
    this.props.history.push('/');
  };

  handleRegisterError = error => {
    this.showErrors(error.data.errors);
  };

  showErrors = errors => {
    this.setState({ errors });
  };

  render() {
    const { values, errors } = this.state;

    return (
      <div className="container container-narrow fullheight-with-nav d-flex justify-content-center flex-column">
        <h1>Register</h1>
        <Form action="/register" method="POST" onSubmit={this.register}>
          {/* Name */}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              placeholder="Your name here..."
              required
              isInvalid={!!errors.name}
              value={values.name}
              onChange={this.handleChange}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Email */}
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Your email here..."
              required
              isInvalid={!!errors.email}
              value={values.email}
              onChange={this.handleChange}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Your password here..."
              required
              isInvalid={!!errors.password}
              value={values.password}
              onChange={this.handleChange}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-secondary">
              Password must be at least 8 characters long.
            </Form.Text>
          </Form.Group>

          <Button type="submit">Register</Button>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  register
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Register)
);
