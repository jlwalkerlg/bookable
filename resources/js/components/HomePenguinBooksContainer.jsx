import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import HomePenguinBooks from './HomePenguinBooks';
import Loading from './Loading';
import { addPenguinBooks } from '../actions/home';

class HomePenguinBooksContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: null
    };

    this.source = axios.CancelToken.source();
  }

  async componentDidMount() {
    if (this.props.books.length) return this.setState({ isLoading: false });

    try {
      const response = await axios.get('/api/books', {
        cancelToken: this.source.token,
        params: {
          limit: 15,
          publisher: 'Penguin Books',
          with: 'author'
        }
      });
      const { books } = response.data;
      this.props.addPenguinBooks(books);
      this.setState({ isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  render() {
    const { isLoading, error } = this.state;
    const { books } = this.props;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomePenguinBooks books={books} />;
  }
}

HomePenguinBooksContainer.propTypes = {
  books: PropTypes.array.isRequired,
  addPenguinBooks: PropTypes.func.isRequired
};

const mapStateToProps = ({ home }) => ({
  books: home.penguinBooks
});

const mapDispatchToProps = {
  addPenguinBooks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePenguinBooksContainer);
