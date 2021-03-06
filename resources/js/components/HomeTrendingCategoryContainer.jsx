import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from './Loading';
import HomeTrendingCategory from './HomeTrendingCategory';
import { addTrendingBook } from '../actions/home';

class HomeTrendingCategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: null
    };

    this.source = axios.CancelToken.source();

    this.category = props.categories[0];
  }

  async componentDidMount() {
    if (this.props.book.id) return this.setState({ isLoading: false });

    try {
      const response = await axios.get('/api/books', {
        cancelToken: this.source.token,
        params: {
          limit: 1,
          order_by: 'ratings_count',
          order_dir: 'desc',
          category_id: this.category.id,
          with: 'author'
        }
      });
      const book = response.data.books[0];
      this.props.addTrendingBook(book);
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
    const { book } = this.props;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomeTrendingCategory category={this.category} book={book} />;
  }
}

HomeTrendingCategoryContainer.propTypes = {
  book: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired
};

const mapStateToProps = ({ home, categories }) => ({
  book: home.trendingBook,
  categories
});

const mapDispatchToProps = {
  addTrendingBook
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeTrendingCategoryContainer);
