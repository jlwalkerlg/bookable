import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const CartCheckoutCard = ({ items }) => {
  const count = items.reduce((prev, current) => prev + current.quantity, 0);

  const subtotal = items.reduce(
    (prev, current) => prev + current.book.price * current.quantity,
    0
  );

  return (
    <Card>
      <Card.Header as="p" className="h5 text-uppercase">
        Checkout
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Total items: <span className="font-weight-bold">{count}</span>
        </Card.Text>
        <Card.Text>
          Tax: <span className="font-weight-bold">£0.00</span>
        </Card.Text>
        <hr />
        <Card.Text>
          Subtotal:{' '}
          <span className="font-weight-bold">£{subtotal.toFixed(2)}</span>
        </Card.Text>
        <Link to="/checkout" className="btn btn-warning">
          Proceed to checkout
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CartCheckoutCard;
