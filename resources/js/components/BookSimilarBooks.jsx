import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import BookCarousel from './BookCarousel';
import Loading from './Loading';

const BookSimilarBooks = ({ books, isLoading, error }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <article className="section text-center bg-beige">
      <Container>
        <h2 className="heading mb-4">
          <span>Customers also bought</span>
        </h2>
        <BookCarousel books={books} />
      </Container>
    </article>
  );
};

BookSimilarBooks.propTypes = {
  books: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object
};

export default BookSimilarBooks;
