import React, { Component } from 'react';
import { Form, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import SubmitButton from '../components/SubmitButton';

class ForgotPassword extends Component {
  state = {
    email: '',
    isInvalidEmail: false,
    isProcessing: false,
    submitted: false
  };

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  handleChange = e =>
    this.setState({ isInvalidEmail: false, email: e.target.value });

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isInvalidEmail: false, isProcessing: true });

    if (!this.validate()) {
      return this.setState({ isProcessing: false });
    }

    const { email } = this.state;

    try {
      await axios.post('/api/passwords/reset', {
        email
      });
    } catch (error) {
      return error;
    }
    this.setState({ isProcessing: false, submitted: true });
  };

  validate() {
    const { email } = this.state;

    if (!this.emailRegex.test(email)) {
      this.setState({ isInvalidEmail: true });
      return false;
    }

    return true;
  }

  render() {
    const { email, isInvalidEmail, isProcessing, submitted } = this.state;

    return (
      <main>
        <Container className="section container-narrow min-vh-100-nav d-flex justify-content-center flex-column">
          {submitted && (
            <Alert variant="success">
              An email has been sent to your account with instructions for
              resetting your password.
            </Alert>
          )}

          <h1>Forgot Password</h1>

          <p>Enter your email below to reset your password.</p>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                name="email"
                placeholder="Your email..."
                value={email}
                isInvalid={isInvalidEmail}
                onChange={this.handleChange}
              />

              <Form.Control.Feedback type="invalid">
                Your email is invalid.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="text-right">
              <SubmitButton
                className="border-radius-4"
                isLoading={isProcessing}
              >
                Submit
              </SubmitButton>
            </div>
          </Form>
        </Container>
      </main>
    );
  }
}

export default ForgotPassword;
