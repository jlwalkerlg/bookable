import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import OrderListing from '../../components/OrderListing';

const CheckoutSuccess = ({ transaction, items, user }) => {
  const subtotal = items.reduce(
    (carry, item) => carry + item.quantity * item.book.price,
    0
  );

  return (
    <main className="section">
      <Container>
        <Alert variant="success">Your order was successful!</Alert>

        <h1 className="h4">Order Confirmation</h1>
        <p className="font-size-7 mb-0">Order #{transaction.id}</p>

        <p>
          Good news: your order was successful! A confirmation email will be
          sent to <strong>{user.email}</strong> shortly.
        </p>

        <h2 className="h5">Order details:</h2>

        <div className="d-flex justify-content-between">
          <div>
            <p className="mb-1">Your order will be sent to:</p>
            <address className="font-size-7 font-weight-bold">
              {transaction.street_address}
              <br />
              {transaction.city}
              <br />
              {transaction.postcode}
            </address>
          </div>

          <div>
            <p className="font-size-7 mb-0">Order #{transaction.id}</p>
            <p className="font-size-7 mt-1">
              Placed on {transaction.charged_at}
            </p>
          </div>
        </div>

        <ul className="list-unstyled mt-3">
          {items.map(item => {
            return <OrderListing key={item.id} item={item} />;
          })}
        </ul>

        <hr />

        <p className="font-weight-bold text-right">
          Order Total: £{subtotal.toFixed(2)}
        </p>
      </Container>
    </main>
  );
};

CheckoutSuccess.propTypes = {
  transaction: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};

export default CheckoutSuccess;
