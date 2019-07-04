import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AuthorDisplay from '../../components/AuthorDisplay';
import Loading from '../../components/Loading';
import AuthorHighestRated from '../../components/AuthorHighestRated';
import AuthorMostRated from '../../components/AuthorMostRated';
import AuthorBooks from '../../components/AuthorBooks';
import AuthorQuotes from '../../components/AuthorQuotes';

class Author extends Component {
  state = {
    isLoadingAuthor: true,
    isLoadingHighestRated: true,
    isLoadingMostRated: true,
    isLoadingBooks: true,
    isLoadingQuotes: true,
    errorAuthor: null,
    errorHighestRated: null,
    errorMostRated: null,
    errorBooks: null,
    errorQuotes: null,
    author: {},
    highestRated: {},
    mostRated: {},
    books: [],
    quotes: []
  };

  source = axios.CancelToken.source();

  componentDidMount() {
    this.fetchAuthor();
    this.fetchHighestRated();
    this.fetchMostRated();
    this.fetchBooks();
    this.fetchQuotes();
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchAuthor() {
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/authors/${authorId}`, {
        cancelToken: this.source.token
      });
      const author = response.data;
      this.setState({ author, isLoadingAuthor: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorAuthor: error, isLoadingAuthor: false });
    }
  }

  async fetchHighestRated() {
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get('/api/books/', {
        cancelToken: this.source.token,
        params: {
          author_id: authorId,
          order_by: 'avg_rating',
          order_dir: 'desc',
          limit: 1
        }
      });
      const highestRated = response.data.books[0];
      this.setState({ highestRated, isLoadingHighestRated: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({
          errorHighestRated: error,
          isLoadingHighestRated: false
        });
    }
  }

  async fetchMostRated() {
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get('/api/books/', {
        cancelToken: this.source.token,
        params: {
          author_id: authorId,
          order_by: 'ratings_count',
          order_dir: 'desc',
          limit: 1
        }
      });
      const mostRated = response.data.books[0];
      this.setState({ mostRated, isLoadingMostRated: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorMostRated: error, isLoadingMostRated: false });
    }
  }

  async fetchBooks() {
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get('/api/books/', {
        cancelToken: this.source.token,
        params: { author_id: authorId }
      });
      const { books } = response.data;
      this.setState({ books, isLoadingBooks: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorBooks: error, isLoadingBooks: false });
    }
  }

  async fetchQuotes() {
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get('/api/quotes', {
        cancelToken: this.source.token,
        params: { author_id: authorId, limit: 5 }
      });
      const { quotes } = response.data;
      this.setState({ quotes, isLoadingQuotes: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorQuotoes: error, isLoadingQuotes: false });
    }
  }

  render() {
    if (this.state.isLoadingAuthor) return <Loading />;

    if (this.state.errorAuthor)
      return <p>Something went wrong: {this.state.errorAuthor.message}.</p>;

    return (
      <>
        <AuthorDisplay author={this.state.author} books={this.state.books} />
        <AuthorHighestRated
          book={this.state.highestRated}
          author={this.state.author}
          isLoading={this.state.isLoadingHighestRated}
          error={this.state.errorHighestRated}
        />
        <AuthorMostRated
          book={this.state.mostRated}
          author={this.state.author}
          isLoading={this.state.isLoadingMostRated}
          error={this.state.errorMostRated}
        />
        <AuthorBooks
          books={this.state.books}
          author={this.state.author}
          isLoading={this.state.isLoadingBooks}
          error={this.state.errorBooks}
        />
        <AuthorQuotes
          quotes={this.state.quotes}
          author={this.state.author}
          isLoading={this.state.isLoadingQuotes}
          error={this.state.errorQuotes}
        />
      </>
    );
  }
}

Author.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      authorId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Author;
