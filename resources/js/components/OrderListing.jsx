import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Media from 'react-bootstrap/Media';

const OrderListing = ({ item }) => {
  const { book } = item;
  const { author } = book;

  return (
    <Media className="border-top py-3 px-1">
      <img src={book.small_image_url} alt={book.title} className="mr-3" />

      <Media.Body className="d-flex justify-content-between">
        <div className="flex-grow-1">
          <p className="mb-0">
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </p>
          <p className="font-size-7 text-secondary my-1">
            <Link to={`/authors/${author.id}`}>{author.name}</Link>
          </p>
          <p className="font-size-7 mt-1">Quantity: {item.quantity}</p>
        </div>
        <div className="ml-3">
          <p className="font-weight-bold">£{book.price}</p>
        </div>
      </Media.Body>
    </Media>
  );
};

OrderListing.propTypes = {
  item: PropTypes.object.isRequired
};

export default OrderListing;
