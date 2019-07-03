import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import HomeBestSeller from './HomeBestSeller';
import Loading from './Loading';
import { addBestSeller } from '../actions/home';

class HomeBestSellerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null
    };

    this.source = axios.CancelToken.source();
  }

  async componentDidMount() {
    if (this.props.book.id) return this.setState({ loading: false });

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
      this.props.addBestSeller(book);
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
    const { book } = this.props;

    if (loading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomeBestSeller book={book} />;
  }
}

HomeBestSellerContainer.propTypes = {
  book: PropTypes.object.isRequired,
  addBestSeller: PropTypes.func.isRequired
};

const mapStateToProps = ({ home }) => ({
  book: home.bestSeller
});

const mapDispatchToProps = {
  addBestSeller
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeBestSellerContainer);
