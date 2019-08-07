import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const WishlistProductRow = ({
  item,
  isProcessingWishlist,
  onRemoveItem,
  isProcessingCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const { book } = item;
  const { author } = book;

  return (
    <Row className="product-table__row">
      <Col md={6}>
        <Media>
          <img src={book.small_image_url} alt={book.title} className="mr-2" />
          <Media.Body>
            <p className="font-display h4">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </p>
            <p>
              <span className="text-secondary">by: </span>
              <Link to={`/authors/${author.id}`}>{author.name}</Link>
            </p>
          </Media.Body>
        </Media>
      </Col>
      <Col md={3}>
        <p>£{book.price}</p>
      </Col>
      <Col md={3}>
        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={item.isInCart ? onRemoveFromCart : onAddToCart}
          className="mb-2"
        >
          <Button
            variant="warning"
            size="sm"
            type="submit"
            className="rounded-pill mr-2"
            disabled={isProcessingCart}
          >
            <i className="material-icons align-top mr-1">
              {item.isInCart ? 'remove_shopping_cart' : 'add_shopping_cart'}
            </i>
            {item.isInCart ? 'Remove From Cart' : 'Add To Cart'}
          </Button>
        </Form>
        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={onRemoveItem}
          className="text-secondary"
        >
          <Button
            variant="link"
            type="submit"
            className="text-danger font-size-7"
            disabled={isProcessingWishlist}
          >
            Remove From Wishlist
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

WishlistProductRow.propTypes = {
  item: PropTypes.object.isRequired,
  isProcessingWishlist: PropTypes.bool.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  isProcessingCart: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
};

export default WishlistProductRow;
