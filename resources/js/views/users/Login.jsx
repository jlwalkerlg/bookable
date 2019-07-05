import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert, Form, Button } from 'react-bootstrap';
import SubmitButton from '../../components/SubmitButton';

const Login = ({
  email,
  password,
  error,
  isProcessing,
  onChange,
  onSubmit
}) => {
  return (
    <main className="bg-beige">
      <Container className="section container-narrow min-vh-100-nav d-flex justify-content-center flex-column">
        {error && (
          <Alert variant="danger">
            There was an issue with the login attempt.
          </Alert>
        )}
        <h1>Login</h1>
        <Form action="/login" method="POST" onSubmit={onSubmit}>
          {/* Email */}
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Your email here..."
              required
              value={email}
              onChange={onChange}
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
              value={password}
              onChange={onChange}
            />
          </Form.Group>

          <SubmitButton isLoading={isProcessing} variant="primary">
            Login
          </SubmitButton>
        </Form>
        <div className="mt-3">
          <Link to="/forgot-password" className="default">
            Forgot your password?
          </Link>
        </div>
      </Container>
    </main>
  );
};

export default Login;
