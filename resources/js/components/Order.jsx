import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';

const Order = ({ transaction }) => {
  const { items } = transaction.cart;

  return (
    <li className="mt-3">
      <Card>
        <Card.Header>
          <div className="d-flex align-items-center">
            <div className="mr-3 font-size-7">
              <p className="mb-0 text-uppercase text-secondary">Order Placed</p>
              <p className="mb-0">{transaction.charged_at}</p>
            </div>

            <div className="mr-3 font-size-7">
              <p className="mb-0 text-uppercase text-secondary">Total</p>
              <p className="mb-0">£{(transaction.amount / 100).toFixed(2)}</p>
            </div>

            <div className="ml-auto font-size-7 text-right">
              <p className="mb-0 text-uppercase text-secondary">Order</p>
              <p className="mb-0">#{transaction.id}</p>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="float-md-right text-md-right font-size-7 mb-3">
            <p className="mb-0 text-uppercase text-secondary">
              Delivery Address
            </p>
            <p>
              {transaction.street_address}
              <br />
              {transaction.city}
              <br />
              {transaction.postcode}
            </p>
          </div>

          {items.map(item => {
            const { book } = item;
            const { author } = book;

            return (
              <Media key={item.id} className="mb-3">
                <img src={book.small_image_url} alt={book.title} />

                <Media.Body className="ml-3">
                  <p className="mb-0">
                    <Link to={`/books/${book.id}`} className="default">
                      {book.title}
                    </Link>
                  </p>

                  <p className="mb-0 font-secondary font-size-7">
                    <Link to={`/authors/${author.id}`}>{author.name}</Link>
                  </p>

                  <p className="mb-0">£{book.price.toFixed(2)}</p>

                  <p className="mb-0 font-size-7 text-secondary">
                    Quantity: {item.quantity}
                  </p>
                </Media.Body>
              </Media>
            );
          })}
        </Card.Body>
      </Card>
    </li>
  );
};

Order.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default Order;
