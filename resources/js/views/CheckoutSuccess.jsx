import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

const CheckoutSuccess = ({ location }) => {
  const transaction = location.state && location.state.transaction;

  if (!transaction) return <Redirect to="/cart" />;

  return (
    <main className="section">
      <Container>
        <Alert variant="success">
          Payment of £{(transaction.amount / 100).toFixed(2)} successful!
        </Alert>
        <p>A confirmation email will be sent to {transaction.email} shortly.</p>
        <p>
          Your order will be shipped to {transaction.street_address},{' '}
          {transaction.city}, {transaction.postcode}
        </p>
      </Container>
    </main>
  );
};

export default CheckoutSuccess;
