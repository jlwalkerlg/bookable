import React from 'react';
import PropTypes from 'prop-types';
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Stars from './Stars';
import Loading from './Loading';

const BookUserReview = ({ review, user, isLoading, error, book }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  if (!review.id)
    return (
      <div className="mt-3">
        <Link to={`/books/${book.id}/reviews/new`} className="default">
          Write a review.
        </Link>
      </div>
    );

  return (
    <section className="mb-5">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="text-secondary">Your review:</p>
          <Link to={`/reviews/${review.id}`} className="default">
            Edit Review
          </Link>
        </div>
        <Media>
          <img
            src={user.avatar}
            alt={`${user.name} profile picture`}
            width="70"
            height="70"
            className="mr-3"
          />
          <Media.Body>
            <div className="d-md-flex">
              <p className="mb-2 mr-auto">
                <span className="h6 mr-2 d-block d-md-inline-block">
                  {user.name}
                </span>
                {review.rating.rating && (
                  <>
                    <span className="mr-2">rated it</span>
                    <Stars rating={review.rating.rating} />
                  </>
                )}
              </p>
              <p className="text-secondary">{review.created_at}</p>
            </div>
            <p>{review.review}</p>
          </Media.Body>
        </Media>
        <hr />
      </div>
    </section>
  );
};

BookUserReview.propTypes = {
  review: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  book: PropTypes.object.isRequired
};

export default BookUserReview;
