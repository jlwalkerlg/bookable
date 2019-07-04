import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import BookDisplay from './BookDisplay';
import Loading from './Loading';
import BookAuthor from './BookAuthor';
import BookAbout from './BookAbout';

class BookDisplayContainer extends Component {
  state = {
    isLoadingBook: true,
    errorBook: null,
    book: {},
    isLoadingQuotes: true,
    errorQuotes: null,
    quotes: []
  };

  componentDidMount() {
    this.fetchBook();
    this.fetchQuotes();
  }

  async fetchBook() {
    const { bookId } = this.props;
    try {
      const response = await axios.get(`/api/books/${bookId}`, {
        params: { with: 'author.books,categories' }
      });
      const book = response.data;
      this.setState({ book, isLoadingBook: false });
    } catch (error) {
      this.setState({ errorBook: error, isLoadingBook: false });
    }
  }

  async fetchQuotes() {
    const { bookId } = this.props;
    try {
      const response = await axios.get('/api/quotes', {
        params: { book_id: bookId, limit: 5 }
      });
      const { quotes } = response.data;
      this.setState({ quotes, isLoadingQuotes: false });
    } catch (error) {
      this.setError({ errorQuotes: error, isLoadingQuotes: false });
    }
  }

  render() {
    const {
      isLoadingBook,
      errorBook,
      book,
      isLoadingQuotes,
      errorQuotes,
      quotes
    } = this.state;
    const { user } = this.props;

    if (isLoadingBook) return <Loading />;

    if (errorBook) return <p>Something went wrong: {errorBook.message}.</p>;

    return (
      <>
        <BookDisplay book={book} user={user} />
        <BookAbout
          book={book}
          quotes={quotes}
          isLoadingQuotes={isLoadingQuotes}
          errorQuotes={errorQuotes}
          quotes={quotes}
        />
        <BookAuthor author={book.author} />
      </>
    );
  }
}

const mapStateToProps = ({ cart, wishlist, user }) => ({
  cart,
  wishlist,
  user
});

export default connect(mapStateToProps)(BookDisplayContainer);
