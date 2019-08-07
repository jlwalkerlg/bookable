import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';
import URL from '../utils/URL';
import SubmitButton from '../components/SubmitButton';

class PasswordReset extends Component {
  state = {
    email: URL.query(this.props.location.search).getParam('email') || '',
    password: '',
    isProcessing: false,
    success: false,
    validationErrors: {},
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
      validationErrors: {
        ...this.state.validationErrors,
        [e.target.name]: null,
      },
    });

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ error: null, isProcessing: true });

    const { token } = this.props.match.params;
    const { email, password } = this.state;

    try {
      await axios.post(`/api/passwords/reset/${token}`, {
        email,
        password,
      });
      this.setState({ success: true, isProcessing: false });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        this.setState({
          validationErrors: error.response.data.errors,
          isProcessing: false,
        });
      } else {
        this.setState({ error, isProcessing: false });
      }
    }
  };

  render() {
    const {
      email,
      password,
      isProcessing,
      success,
      error,
      validationErrors,
    } = this.state;
    const { token } = this.props.match.params;

    return (
      <main>
        <Container className="section container-narrow min-vh-100-nav d-flex justify-content-center flex-column">
          {success && (
            <Alert variant="success">
              Password successfully reset. You may now{' '}
              <strong>
                <Link to="/login">login</Link>
              </strong>{' '}
              with your new password.
            </Alert>
          )}

          {error && (
            <Alert variant="danger">
              Something went wrong: {error.message}.
            </Alert>
          )}

          <h1>Reset Password</h1>

          {!success && (
            <Form onSubmit={this.handleSubmit}>
              {/* Email */}
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>

                <Form.Control
                  name="email"
                  placeholder="Your email..."
                  value={email}
                  onChange={this.handleChange}
                  isInvalid={!!validationErrors.email}
                />

                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group controlId="password">
                <Form.Label>New Password</Form.Label>

                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Your new password..."
                  value={password}
                  onChange={this.handleChange}
                  isInvalid={!!validationErrors.password}
                />

                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Token */}
              <Form.Control hidden readOnly value={token} name="token" />

              {/* Submit */}
              <div className="text-right">
                <SubmitButton isLoading={isProcessing}>Submit</SubmitButton>
              </div>
            </Form>
          )}
        </Container>
      </main>
    );
  }
}

export default PasswordReset;
