import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import HomePenguinBooks from './HomePenguinBooks';
import Loading from './Loading';
import { addPenguinBooks } from '../actions/home';

class HomePenguinBooksContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null
    };

    this.source = axios.CancelToken.source();
  }

  async componentDidMount() {
    if (this.props.books.length) return this.setState({ loading: false });

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
      this.setState({ loading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, loading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  render() {
    const { loading, error } = this.state;
    const { books } = this.props;

    if (loading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomePenguinBooks books={books} />;
  }
}

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
