import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import ProductCard from './ProductCard';

const AuthorBooks = ({ books, author, isLoading, error }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <article className="section text-center">
      <h2 className="heading mb-4">
        <span>All books by {author.name}</span>
      </h2>
      <div className="d-flex flex-wrap justify-content-center">
        {books.map(book => (
          <ProductCard key={book.id} book={book} className="mx-3" />
        ))}
      </div>
    </article>
  );
};

AuthorBooks.propTypes = {
  books: PropTypes.array.isRequired,
  author: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object
};

export default AuthorBooks;
