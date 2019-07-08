import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import ShelfItemsTable from './ShelfItemsTable';
import BookListing from './BookListing';
import Pagination from './Pagination';

const ShelvesItems = ({
  user,
  userId,
  items,
  page,
  limit,
  count,
  pathname,
  onAddRating,
  onUpdateRating,
  isProcessingRating,
  onDeleteItem,
  isProcessingItem
}) => {
  return (
    <>
      <MediaQuery minWidth={768}>
        {matches =>
          matches ? (
            <ShelfItemsTable
              className="d-none d-md-table mt-3"
              user={user}
              userId={userId}
              items={items}
              onAddRating={onAddRating}
              onUpdateRating={onUpdateRating}
              isProcessingRating={isProcessingRating}
              onDeleteItem={onDeleteItem}
              isProcessingItem={isProcessingItem}
            />
          ) : (
            <div className="d-md-none mb-3">
              {items.map(item => {
                const { book, rating, userRating } = item;

                return (
                  <BookListing
                    key={item.id}
                    className="product-table__row py-3"
                    user={user}
                    userId={userId}
                    book={book}
                    author={book.author}
                    rating={item.rating}
                    userRating={item.userRating}
                    createdAt={item.created_at}
                    onAddRating={onAddRating}
                    onUpdateRating={onUpdateRating}
                    isProcessingRating={isProcessingRating}
                    deletable={user.id === parseInt(userId)}
                    onDelete={onDeleteItem}
                    isProcessingDelete={isProcessingItem}
                  />
                );
              })}
            </div>
          )
        }
      </MediaQuery>
      <Pagination
        totalItems={count}
        currentPage={page}
        pageSize={limit}
        maxPages={5}
        url={`${pathname}?page=`}
        className="justify-content-center pagination-warning"
      />
    </>
  );
};

ShelvesItems.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  onAddRating: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired,
  isProcessingRating: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  isProcessingItem: PropTypes.bool.isRequired
};

export default ShelvesItems;
