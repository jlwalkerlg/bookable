import React from 'react';
import { Container, Alert, Form } from 'react-bootstrap';
import SubmitButton from '../../components/SubmitButton';

const Register = ({
  name,
  email,
  password,
  validationErrors,
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
        <h1>Register</h1>
        <Form action="/register" method="POST" onSubmit={onSubmit}>
          {/* Name */}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              placeholder="Your name here..."
              isInvalid={!!validationErrors.name}
              value={name}
              onChange={onChange}
            />
            {validationErrors.name && (
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
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
              isInvalid={!!validationErrors.email}
              value={email}
              onChange={onChange}
            />
            {validationErrors.email && (
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
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
              isInvalid={!!validationErrors.password}
              value={password}
              onChange={onChange}
            />
            {validationErrors.password && (
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-secondary">
              Password must be at least 8 characters long.
            </Form.Text>
          </Form.Group>

          <SubmitButton variant="primary" isLoading={isProcessing}>
            Register
          </SubmitButton>
        </Form>
      </Container>
    </main>
  );
};

export default Register;
