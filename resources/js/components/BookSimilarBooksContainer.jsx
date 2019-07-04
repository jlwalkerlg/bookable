import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import BookCarousel from './BookCarousel';

const books = new Array(15).fill(0).map(() => ({
  id: 1,
  image_url: 'https://images.gr-assets.com/books/1483412266m/865.jpg',
  title: 'The Alchemist',
  author: { id: 1, name: 'Paulo Coelho' },
  price: 14.99,
  author_id: 1
}));

class BookSimilarBooksContainer extends Component {
  render() {
    const { bookId } = this.props;

    return (
      <article className="section text-center bg-beige">
        <Container>
          <h2 className="heading mb-4">
            <span>Readers also enjoyed</span>
          </h2>
          <BookCarousel books={books} />
        </Container>
      </article>
    );
  }
}

export default BookSimilarBooksContainer;
