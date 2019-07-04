import React from 'react';
import { Form, Button } from 'react-bootstrap';

const BookWishlistForm = ({
  book,
  isInWishlist,
  removeFromWishlist,
  addToWishlist
}) => {
  return (
    <Form
      action="/"
      method="POST"
      data-book={book}
      onSubmit={isInWishlist ? removeFromWishlist : addToWishlist}
      className="mb-3"
    >
      <Button variant="link" type="submit" className="link-secondary pl-0">
        <i className="material-icons text-danger align-top mr-1">
          {isInWishlist ? 'favorite' : 'favorite_border'}
        </i>
        {isInWishlist ? 'Remove From Wishlist' : 'Add To Wishlist'}
      </Button>
    </Form>
  );
};

export default BookWishlistForm;
