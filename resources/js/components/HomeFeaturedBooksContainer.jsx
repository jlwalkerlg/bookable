import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from './Loading';
import HomeFeaturedBooks from './HomeFeaturedBooks';
import { addFeaturedBooks } from '../actions/home';

class HomeFeaturedBooksContainer extends Component {
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
        params: { limit: 15, order_by: 'random', with: 'author' }
      });
      const { books } = response.data;
      this.props.addFeaturedBooks(books);
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

    return <HomeFeaturedBooks books={books} />;
  }
}

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
