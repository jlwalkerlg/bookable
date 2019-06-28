import React from 'react';
import { Media } from 'react-bootstrap';
import Stars from './Stars';

const BookReviews = ({ reviews, className }) => {
  return (
    <section className={className}>
      {!reviews.length && <p>No reviews to show.</p>}
      {reviews.map((review, index) => (
        <Media key={index}>
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
                <span className="h6 mr-2 d-block d-md-inline-block">
                  {review.user.name}
                </span>
                {review.rating && (
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
      ))}
    </section>
  );
};

export default BookReviews;
