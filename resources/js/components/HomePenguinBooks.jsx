import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import ProductCard from './ProductCard';

const HomePenguinBooks = ({ books }) => {
  return (
    <article className="section text-center">
      <Container>
        <h2 className="heading mb-5">
          <span>Penguin Classics</span>
        </h2>
        <div className="d-flex justify-content-center flex-wrap mb-4">
          {books.map(book => (
            <ProductCard key={book.id} book={book} className="mx-3" />
          ))}
        </div>
      </Container>
    </article>
  );
};

HomePenguinBooks.propTypes = {
  books: PropTypes.array.isRequired
};

export default HomePenguinBooks;
