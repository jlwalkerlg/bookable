import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Media from 'react-bootstrap/Media';
import sanitize from '../utils/sanitize';

const reviewText = review =>
  review.length > 300 ? review.slice(0, 300).trim() + '...' : review;

const ReviewListing = ({ user, userId, book, author, review }) => {
  const userIdInt = parseInt(userId);

  return (
    <Media className="mt-3 py-2 border-bottom">
      <img src={book.image_url} alt={book.title} className="mr-3" />
      <Media.Body>
        <p className="h5">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by: </span>
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>
        <p className="font-size-7 mb-3">
          <span className="text-secondary">Date Added:</span>{' '}
          {review.created_at}
        </p>
        <div className="mb-2">
          <p className="text-secondary font-size-7 mb-0">
            {user.id === userIdInt ? 'Your' : 'User'} Review:
          </p>
          <p
            className="mt-0"
            dangerouslySetInnerHTML={sanitize.markup(reviewText(review.review))}
          />
          <div>
            {user.id !== userIdInt && (
              <Link to={`/reviews/${review.id}`}>Read full review</Link>
            )}
            {user.id !== userIdInt && review.userReview && (
              <span className="d-inline-block mx-2">&#183;</span>
            )}
            {review.userReview && (
              <Link to={`/reviews/${review.userReview.id}`}>
                Read your review
              </Link>
            )}
          </div>
        </div>
      </Media.Body>
    </Media>
  );
};

ReviewListing.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired
};

export default ReviewListing;
