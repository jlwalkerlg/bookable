import React, { Component } from 'react';
import axios from 'axios';
import Loading from './Loading';
import HomeFeaturedBooks from './HomeFeaturedBooks';

class HomeFeaturedBooksContainer extends Component {
  state = {
    loading: true,
    error: null,
    books: []
  };

  source = axios.CancelToken.source();

  async componentDidMount() {
    try {
      const response = await axios.get('/api/books', {
        cancelToken: this.source.token,
        params: { limit: 15, order_by: 'random', with: 'author' }
      });
      const { books } = response.data;
      this.setState({ books, loading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, loading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  render() {
    const { loading, error, books } = this.state;

    if (loading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomeFeaturedBooks books={books} />;
  }
}

export default HomeFeaturedBooksContainer;
