import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Media from 'react-bootstrap/Media';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ProductListing = ({ item, isProcessingDelete, onDelete }) => {
  const { book } = item;

  return (
    <Media className="product-table__row">
      <img src={book.image_url} alt={book.title} className="mr-4 mr-md-2" />
      <Media.Body className="position-relative">
        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={onDelete}
          className="float-right"
        >
          <Button
            variant="link"
            type="submit"
            aria-label="Remove from cart"
            className="text-danger pt-0"
            disabled={isProcessingDelete}
          >
            <i className="material-icons">clear</i>
          </Button>
        </Form>
        <p className="font-display h4">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by: </span>
          <Link to={`/authors/${book.author.id}`}>{book.author.name}</Link>
        </p>
        <p className="text-warning">
          <span className="text-secondary">Price:</span> £
          {book.price.toFixed(2)}
        </p>
        <p>
          <span className="text-secondary">Quantity:</span>{' '}
          <span className="font-weight-bold">{item.quantity}</span>
        </p>
      </Media.Body>
    </Media>
  );
};

ProductListing.propTypes = {
  item: PropTypes.object.isRequired,
  isProcessingDelete: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductListing;
