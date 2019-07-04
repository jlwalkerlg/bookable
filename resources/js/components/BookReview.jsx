import React from 'react';
import { Link } from 'react-router-dom';
import { Media } from 'react-bootstrap';
import Stars from './Stars';

const BookReview = ({ review }) => {
  const { user, rating } = review;

  const reviewText =
    review.review.length > 300
      ? review.review
      : review.review.slice(0, 300) + '...';

  return (
    <Media className="mt-4">
      <img
        src="https://via.placeholder.com/150/92c952"
        alt={`${review.user.name} profile picture`}
        width="70"
        height="70"
        className="mr-3"
      />
      <Media.Body>
        <div className="d-md-flex">
          <p className="mb-2 mr-auto">
            <Link
              to={`/users/${user.id}`}
              className="h6 mr-2 d-block d-md-inline-block"
            >
              {review.user.name}
            </Link>
            {rating && (
              <>
                <span className="mr-2">rated it</span>
                <Stars rating={rating.rating} />
              </>
            )}
          </p>
          <p className="text-secondary">{review.created_at}</p>
        </div>
        <p className="mb-0">{reviewText}</p>
        <Link to={`/reviews/${review.id}`} className="default d-block mt-2">
          Read full review
        </Link>
      </Media.Body>
    </Media>
  );
};

export default BookReview;
