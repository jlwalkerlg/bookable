import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import SortBySelect from './SortBySelect';
import Pagination from './Pagination';
import ProductCard from './ProductCard';

const sortOptions = {
  'ratings_count.desc': 'Ratings (desc)',
  'ratings_count.asc': 'Ratings (asc)',
  'avg_rating.desc': 'Avg Rating (desc)',
  'avg_rating.asc': 'Avg Rating (asc)',
  'price.desc': 'Price (desc)',
  'price.asc': 'Price (asc)',
  'publication_date.desc': 'Date (desc)',
  'publication_date.asc': 'Date (asc)'
};

const CategoryBooks = ({
  books,
  category,
  isLoading,
  error,
  page,
  limit,
  count,
  pathname,
  orderDir,
  orderBy,
  onSortChange
}) => {
  const order = `${orderBy}.${orderDir}`;

  return (
    <>
      <div className="d-sm-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-2 mb-sm-0 text-uppercase">
          Books in {category.name}
        </h2>
        <SortBySelect
          options={sortOptions}
          value={order}
          disabled={isLoading}
          onChange={onSortChange}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p>Something went wrong: {error.message}.</p>
      ) : (
        <>
          <div className="category-products">
            {books.map(book => (
              <ProductCard
                key={book.id}
                book={book}
                size="large"
                wishlistButton
              />
            ))}
          </div>
          <Pagination
            totalItems={count}
            currentPage={page}
            pageSize={limit}
            maxPages={5}
            url={`${pathname}?page=`}
            className="justify-content-center pagination-warning mt-3"
          />
        </>
      )}
    </>
  );
};

CategoryBooks.propTypes = {
  books: PropTypes.array.isRequired,
  category: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  orderDir: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default CategoryBooks;
