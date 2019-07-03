import React, { Component } from 'react';
import axios from 'axios';
import HomeBestSeller from './HomeBestSeller';
import Loading from './Loading';

class HomeBestSellerContainer extends Component {
  state = {
    loading: true,
    error: null,
    book: {}
  };

  source = axios.CancelToken.source();

  async componentDidMount() {
    try {
      const response = await axios.get('/api/books', {
        cancelToken: this.source.token,
        params: {
          limit: 1,
          order_by: 'ratings_count',
          order_dir: 'desc',
          with: 'author'
        }
      });
      const book = response.data.books[0];
      this.setState({ book, loading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, loading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  render() {
    const { loading, error, book } = this.state;

    if (loading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomeBestSeller book={book} />;
  }
}

export default HomeBestSellerContainer;