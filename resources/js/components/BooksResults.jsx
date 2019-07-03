import React from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import ProductCard from './ProductCard';
import Loading from './Loading';

const BooksResults = ({ isLoading, error, books, count, page, limit }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <main>
      <div className="browse-products mb-4">
        {books.map((book, index) => (
          <ProductCard key={index} book={book} size="large" wishlistButton />
        ))}
      </div>
      <Pagination
        totalItems={count}
        currentPage={page}
        pageSize={limit}
        maxPages={5}
        url="/books?page="
        className="justify-content-center pagination-warning"
      />
    </main>
  );
};

BooksResults.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};

export default BooksResults;
