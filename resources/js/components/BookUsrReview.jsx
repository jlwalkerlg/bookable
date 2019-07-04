import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import BookUserReview from './BookUserReview';

const BookUsrReview = ({ isLoading, error, review }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return review ? (
    <BookUserReview review={review} user={user} />
  ) : (
    <Link to={`/books/${book.id}/reviews/new`} className="default">
      Write a review.
    </Link>
  );
};

export default BookUsrReview;
