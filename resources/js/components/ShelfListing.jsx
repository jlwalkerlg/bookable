import React from 'react';

const ShelfListing = () => {
  return (
    <Media key={index} className="product-table__row py-3">
      <img src={book.image_url} alt={book.title} className="mr-3" />
      <Media.Body>
        {isOwnShelf && (
          <Form
            action="/"
            method="POST"
            onSubmit={e => this.removeFromShelf(e, shelfItem)}
          >
            <Button
              variant="link"
              type="submit"
              className="text-danger p-0 font-size-7"
            >
              Remove from shelf
            </Button>
          </Form>
        )}
        <p className="h5">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by: </span>
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>
        <p className="font-size-7 mb-2">
          <span className="text-secondary">Average rating:</span>{' '}
          {book.avg_rating.toFixed(2)}
        </p>
        {!isOwnShelf && (
          <p className="font-size-7 mb-2">
            <span className="text-secondary">User rating:</span>{' '}
            <Stars rating={(userRating && userRating.rating) || 0} />
          </p>
        )}
        {authUser.id && (
          <p className="mb-2">
            <span className="text-secondary font-size-7">Your rating:</span>{' '}
            <Stars rating={(authUserRating && authUserRating.rating) || 0} />
          </p>
        )}
        <p className="font-size-7 mb-2">
          <span className="text-secondary">Date Added:</span>{' '}
          {shelfItem.created_at}
        </p>
      </Media.Body>
    </Media>
  );
};

export default ShelfListing;
