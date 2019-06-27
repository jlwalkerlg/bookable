import React from 'react';
import { Link } from 'react-router-dom';
import { Media } from 'react-bootstrap';
import sanitize from '../utils/sanitize';

const ReviewListing = ({
  book,
  author,
  review,
  userReview,
  createdAt,
  className
}) => {
  return (
    <Media className={className}>
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
          <span className="text-secondary">Date Added:</span> {createdAt}
        </p>
        {review && (
          <div className="mb-2">
            <p className="text-secondary font-size-7 mb-0">User Review:</p>
            <p
              className="mt-0"
              dangerouslySetInnerHTML={sanitize.markup(
                review.review.slice(0, 300) + '...'
              )}
            />
            <p>
              <Link to={`/reviews/${review.id}`}>Read full review</Link>
            </p>
            {userReview && (
              <p>
                <Link to={`/reviews/${userReview.id}`}>Read your review</Link>
              </p>
            )}
          </div>
        )}
        {!review && userReview && (
          <div className="mb-2">
            <p className="text-secondary font-size-7 mb-0">Your Review:</p>
            <p
              className="mt-0"
              dangerouslySetInnerHTML={sanitize.markup(
                userReview.review.slice(0, 300) + '...'
              )}
            />
            <Link to={`/reviews/${userReview.id}`}>Read full review</Link>
          </div>
        )}
      </Media.Body>
    </Media>
  );
};

export default ReviewListing;
