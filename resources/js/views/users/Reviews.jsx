import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import ReviewListing from '../../components/ReviewListing';
import Pagination from '../../components/Pagination';

const Reviews = ({
  user,
  userId,
  authUser,
  reviews,
  count,
  page,
  limit,
  pathname
}) => {
  return (
    <div className="section">
      <Container>
        <h1 className="h5 text-uppercase mb-0">{user.name}&apos;s Reviews</h1>

        {!count && <p>{user.name} has not rated any books.</p>}

        {count && (
          <>
            <div className="mt-3">
              {reviews.map(review => {
                const { book } = review;
                const { author } = book;

                return (
                  <ReviewListing
                    key={review.id}
                    user={authUser}
                    userId={userId}
                    book={book}
                    author={author}
                    review={review}
                    className="mt-3 py-2 border-bottom"
                  />
                );
              })}
            </div>

            <Pagination
              totalItems={count}
              currentPage={page}
              pageSize={limit}
              url={`${pathname}?page=`}
              className="justify-content-center pagination-warning mt-4"
            />
          </>
        )}
      </Container>
    </div>
  );
};

Reviews.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  authUser: PropTypes.object.isRequired,
  reviews: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired
};

export default Reviews;
