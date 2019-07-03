import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from './Loading';
import HomeFeaturedBooks from './HomeFeaturedBooks';
import { addFeaturedBooks } from '../actions/home';

class HomeFeaturedBooksContainer extends Component {
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
        params: { limit: 15, order_by: 'random', with: 'author' }
      });
      const { books } = response.data;
      this.props.addFeaturedBooks(books);
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

    return <HomeFeaturedBooks books={books} />;
  }
}

HomeFeaturedBooksContainer.propTypes = {
  books: PropTypes.array.isRequired,
  addFeaturedBooks: PropTypes.func.isRequired
};

const mapStateToProps = ({ home }) => ({
  books: home.featuredBooks
});

const mapDispatchToProps = {
  addFeaturedBooks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeFeaturedBooksContainer);
