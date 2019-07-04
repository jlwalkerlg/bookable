import React from 'react';
import PropTypes from 'prop-types';
import FeaturedBook from './FeaturedBook';
import Loading from './Loading';

const AuthorMostRated = ({ book, author, isLoading, error }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <article className="section bg-beige text-center">
      <FeaturedBook
        title="Most rated book"
        book={book}
        author={author}
        variant="right"
      />
    </article>
  );
};

AuthorMostRated.propTypes = {
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object
};

export default AuthorMostRated;
