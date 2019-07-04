import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import BookReview from './BookReview';

const BookReviews = ({ isLoading, error, reviews }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Somethign went wrong: {error.message}.</p>;

  return !reviews.length ? (
    <p>No reviews to show.</p>
  ) : (
    reviews.map(review => {
      return <BookReview key={review.id} review={review} />;
    })
  );
};

BookReviews.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  reviews: PropTypes.array.isRequired
};

export default BookReviews;
