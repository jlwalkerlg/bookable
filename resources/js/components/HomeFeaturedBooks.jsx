import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import BookCarousel from './BookCarousel';

const HomeFeaturedBooks = ({ books }) => {
  return (
    <article className="section text-center bg-beige">
      <Container>
        <h2 className="heading mb-5">
          <span>Featured Books</span>
        </h2>
        <BookCarousel books={books} jagged={true} />
      </Container>
    </article>
  );
};

HomeFeaturedBooks.propTypes = {
  books: PropTypes.array.isRequired
};

export default HomeFeaturedBooks;
