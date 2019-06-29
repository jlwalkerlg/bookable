import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const CheckoutSuccess = () => (
  <main className="section">
    <Container>
      <Alert variant="success">Payment succesful!</Alert>
      <p>You will recieve an confirmation email shortly.</p>
    </Container>
  </main>
);

export default CheckoutSuccess;
