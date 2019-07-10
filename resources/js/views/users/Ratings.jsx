import React from 'react';
import PropTypes from 'prop-types';
import RatingsTable from '../../components/RatingsTable';
import Pagination from '../../components/Pagination';
import BookListing from '../../components/BookListing';

const Ratings = ({
  user,
  userId,
  authUser,
  ratings,
  count,
  limit,
  page,
  pathname,
  onAddRating,
  onUpdateRating,
  onDeleteRating,
  isProcessingRating
}) => {
  if (!count) return <p>{user.name} has not rated any books.</p>;

  return (
    <>
      <RatingsTable
        user={authUser}
        userId={userId}
        ratings={ratings}
        onAddRating={onAddRating}
        onUpdateRating={onUpdateRating}
        onDeleteRating={onDeleteRating}
        isProcessingRating={isProcessingRating}
      />

      <div className="d-md-none mt-3">
        {ratings.map(rating => {
          const { book } = rating;

          return (
            <BookListing
              key={rating.id}
              user={authUser}
              userId={userId}
              book={book}
              author={book.author}
              rating={rating.rating}
              userRating={rating.userRating}
              createdAt={rating.created_at}
              onAddRating={onAddRating}
              onUpdateRating={onUpdateRating}
              isProcessingRating={isProcessingRating}
              deletable={rating.userRating && authUser.id === user.id}
              onDelete={onDeleteRating}
              isProcessingDelete={isProcessingRating}
              className="mt-3"
            />
          );
        })}
      </div>

      <Pagination
        totalItems={count}
        currentPage={page}
        pageSize={limit}
        maxPages={5}
        url={`${pathname}?page=`}
        className="mt-3 justify-content-center pagination-warning"
      />
    </>
  );
};

Ratings.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  authUser: PropTypes.object.isRequired,
  ratings: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  onAddRating: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired,
  onDeleteRating: PropTypes.func.isRequired,
  isProcessingRating: PropTypes.bool.isRequired
};

export default Ratings;
