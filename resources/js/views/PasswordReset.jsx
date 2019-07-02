import React, { Component } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import URL from '../utils/URL';

class PasswordReset extends Component {
  state = {
    email: URL.query(this.props.location.search).getParam('email') || '',
    password: '',
    success: false
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { token } = this.props.match.params;
    const { email, password } = this.state;
    try {
      const response = await axios.post(`/api/passwords/reset/${token}`, {
        email,
        password
      });
      this.setState({ success: true });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, success } = this.state;
    const { token } = this.props.match.params;

    return (
      <div className="section">
        <Container>
          {success && (
            <Alert variant="success">
              Password successfully reset. You may now{' '}
              <Link to="/login">login</Link> with your new password.
            </Alert>
          )}
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
                />
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
                />
              </Form.Group>
              {/* Token */}
              <Form.Control hidden readOnly value={token} name="token" />
              {/* Submit */}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Container>
      </div>
    );
  }
}

export default PasswordReset;
