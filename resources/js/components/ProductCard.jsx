import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const ProductCard = ({
  image,
  title,
  bookId,
  author,
  authorId,
  price,
  className,
  wishlistButton,
  inWishlist,
  toggleWishlist,
  ...props
}) => {
  return (
    <div {...props} className={`product-card ${className || ''}`}>
      <img src={image} alt={title} className="product-card__img" />
      {wishlistButton && (
        <Form
          action="/"
          method="POST"
          onSubmit={toggleWishlist}
          className="float-right"
        >
          <Button
            variant="link"
            type="submit"
            className="link-secondary p-0"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className="material-icons text-danger">
              {inWishlist ? 'favorite' : 'favorite_border'}
            </i>
          </Button>
        </Form>
      )}
      <Link to={`/books/${bookId}`} className="product-card__title">
        {title}
      </Link>
      {author && (
        <p className="product-card__author">
          <span className="text-secondary">by: </span>
          <Link to={`/authors/${authorId}`}>{author}</Link>
        </p>
      )}
      <p className="product-card__price">£{price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
