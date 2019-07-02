import React, { Component } from 'react';
import { Form, Container, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

class ForgotPassword extends Component {
  state = {
    email: '',
    submitted: false
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { email } = this.state;
    try {
      const response = await axios.post('/api/passwords/reset', {
        email
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = e => this.setState({ email: e.target.value });

  render() {
    return (
      <main className="section">
        <Container>
          {this.state.submitted && (
            <Alert variant="success">
              An email has been sent to your account with instructions for
              resetting your password.
            </Alert>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                placeholder="Enter email..."
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        </Container>
      </main>
    );
  }
}

export default ForgotPassword;
