import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Media, Form, Button } from 'react-bootstrap';

const WishlistProductListing = ({
  item,
  isProcessingWishlist,
  onRemoveItem,
  isProcessingCart,
  onAddToCart,
  onRemoveFromCart
}) => {
  const { book } = item;
  const { author } = book;

  return (
    <Media className="product-table__row">
      <img src={book.image_url} alt={book.title} className="mr-4 mr-md-2" />

      <Media.Body>
        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={onRemoveItem}
          className="float-right"
        >
          <Button
            variant="link"
            type="submit"
            aria-label="Remove from wishlist"
            className="text-danger pt-0"
            disabled={isProcessingWishlist}
          >
            <i className="material-icons">clear</i>
          </Button>
        </Form>

        <p className="font-display h4">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>

        <p>
          <span className="text-secondary">by: </span>
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>

        <p className="text-warning h4">£{book.price.toFixed(2)}</p>

        <Form
          action="/"
          method="POST"
          data-book-id={book.id}
          onSubmit={item.isInCart ? onRemoveFromCart : onAddToCart}
          className="mt-3"
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
      </Media.Body>
    </Media>
  );
};

WishlistProductListing.propTypes = {
  item: PropTypes.object.isRequired,
  isProcessingWishlist: PropTypes.bool.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  isProcessingCart: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired
};

export default WishlistProductListing;
