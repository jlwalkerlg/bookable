import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Media, Button, Form } from 'react-bootstrap';
import Stars from './Stars';

const BookListing = ({
  className,
  user,
  userId,
  book,
  author,
  rating,
  userRating,
  createdAt,
  onAddRating,
  onUpdateRating,
  isProcessingRating,
  deletable,
  onDelete,
  isProcessingDelete
}) => {
  const userIdInt = parseInt(userId);

  return (
    <Media className={className}>
      <img src={book.image_url} alt={book.title} className="mr-3" />
      <Media.Body>
        {deletable && (
          <Form
            action="/"
            method="POST"
            className="float-right"
            data-book-id={book.id}
            onSubmit={onDelete}
          >
            <Button
              variant="link"
              type="submit"
              className="text-body p-0"
              disabled={isProcessingDelete}
            >
              <i className="material-icons">clear</i>
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
        {user.id !== userIdInt && (
          <p className="mb-2">
            <span className="text-secondary font-size-7">User Rating:</span>{' '}
            <Stars rating={rating || 0} />
          </p>
        )}
        {user.id && (
          <p className="mb-2">
            <span className="text-secondary font-size-7">Your rating:</span>{' '}
            <Stars
              rating={userRating || 0}
              editable
              data-rating={userRating}
              data-book-id={book.id}
              onClick={userRating ? onUpdateRating : onAddRating}
              className={isProcessingRating && 'disabled'}
            />
          </p>
        )}
        <p className="font-size-7 mb-2">
          <span className="text-secondary">Date Added:</span> {createdAt}
        </p>
      </Media.Body>
    </Media>
  );
};

BookListing.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  rating: PropTypes.number,
  userRating: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  onAddRating: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired,
  isProcessingRating: PropTypes.bool,
  deletable: PropTypes.bool,
  onDelete: PropTypes.func,
  isProcessingDelete: PropTypes.bool
};

export default BookListing;
