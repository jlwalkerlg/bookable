import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ProductRow = ({ item, isProcessingDelete, onDelete }) => {
  const { book } = item;

  return (
    <Row className="product-table__row">
      <Col md={3}>
        <Media>
          <img src={book.small_image_url} alt={book.title} className="mr-2" />
          <Media.Body>
            <p className="font-display h4">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </p>
            <p>
              <span className="text-secondary">by:</span>{' '}
              <Link to={`/authors/${book.author.id}`}>{book.author.name}</Link>
            </p>
          </Media.Body>
        </Media>
      </Col>
      <Col md={3}>
        <p>£{book.price.toFixed(2)}</p>
      </Col>
      <Col md={3}>
        <p>{item.quantity}</p>
      </Col>
      <Col md={3}>
        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={onDelete}
          className="mb-2"
        >
          <Button
            variant="link"
            type="submit"
            aria-label="Remove from cart"
            className="text-danger mr-2"
            disabled={isProcessingDelete}
          >
            <i className="material-icons align-top mr-1">clear</i>
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

ProductRow.propTypes = {
  item: PropTypes.object.isRequired,
  isProcessingDelete: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductRow;
