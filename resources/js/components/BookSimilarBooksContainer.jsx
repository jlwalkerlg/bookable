import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import BookCarousel from './BookCarousel';
import Loading from './Loading';

class BookSimilarBooksContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    books: []
  };

  async componentDidMount() {
    const { bookId } = this.props;
    try {
      const response = await axios.get(`/api/books/${bookId}/similar`, {
        params: { limit: 15 }
      });
      const books = response.data;
      this.setState({ books, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    const { isLoading, error, books } = this.state;

    if (isLoading)
      return (
        <div>
          <Loading />
        </div>
      );

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
  }
}

export default BookSimilarBooksContainer;
