import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import BookReview from './BookReview';
import SubmitButton from './SubmitButton';

const BookReviews = ({
  isLoading,
  error,
  reviews,
  onFetchReviews,
  countReviews,
  countUserReview
}) => {
  if (isLoading && !countReviews) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  if (!reviews.length) return <p>No reviews to show.</p>;

  return (
    <>
      {reviews.map(review => {
        return <BookReview key={review.id} review={review} />;
      })}

      {countReviews > reviews.length + countUserReview && (
        <div className="mt-3 text-center">
          <SubmitButton
            variant="link"
            isLoading={isLoading}
            onClick={onFetchReviews}
          >
            Load More Reviews
          </SubmitButton>
        </div>
      )}
    </>
  );
};

BookReviews.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  reviews: PropTypes.array.isRequired,
  onFetchReviews: PropTypes.func.isRequired,
  countReviews: PropTypes.number.isRequired,
  countUserReview: PropTypes.number.isRequired
};

export default BookReviews;
