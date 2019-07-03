import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import BookCarousel from './BookCarousel';

const HomeNewBooks = ({ books }) => {
  return (
    <article className="section text-center">
      <Container>
        <h2 className="heading mb-5">
          <span>New Books</span>
        </h2>
        <BookCarousel books={books} jagged={true} />
      </Container>
    </article>
  );
};

HomeNewBooks.propTypes = {
  books: PropTypes.array.isRequired
};

export default HomeNewBooks;
