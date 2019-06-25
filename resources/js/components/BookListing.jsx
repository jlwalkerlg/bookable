import React from 'react';
import { Link } from 'react-router-dom';
import { Media, Button, Form } from 'react-bootstrap';
import Stars from './Stars';

const BookListing = ({
  book,
  author,
  rating,
  userRating,
  user,
  authUser,
  onAddRating,
  onUpdateRating,
  createdAt,
  deletable,
  onDelete,
  className
}) => {
  return (
    <Media className={className}>
      <img src={book.image_url} alt={book.title} className="mr-3" />
      <Media.Body>
        {deletable && (
          <Form
            action="/"
            method="POST"
            className="float-right"
            onSubmit={e => onDelete(e)}
          >
            <Button variant="link" type="submit" className="text-body p-0">
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
        {user.id !== authUser.id && (
          <p className="mb-2">
            <span className="text-secondary font-size-7">User Rating:</span>{' '}
            <Stars rating={(rating && rating.rating) || 0} />
          </p>
        )}
        {authUser.id && (
          <p className="mb-2">
            <span className="text-secondary font-size-7">Your rating:</span>{' '}
            <Stars
              rating={(userRating && userRating.rating) || 0}
              editable
              onClick={
                userRating
                  ? e => onUpdateRating(e, userRating)
                  : e => onAddRating(e, book)
              }
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

export default BookListing;
