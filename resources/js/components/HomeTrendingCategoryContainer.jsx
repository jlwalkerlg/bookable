import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from './Loading';
import HomeTrendingCategory from './HomeTrendingCategory';

class HomeTrendingCategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.category = props.categories[0];

    this.state = {
      loading: true,
      error: null,
      book: {}
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/books', {
        params: {
          limit: 1,
          order_by: 'ratings_count',
          order_dir: 'desc',
          category_id: this.category.id,
          with: 'author'
        }
      });
      const book = response.data.books[0];
      this.setState({ book, loading: false });
    } catch (error) {
      this.setError({ error, loading: false });
    }
  }

  render() {
    const { loading, error, book } = this.state;

    if (loading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <HomeTrendingCategory category={this.category} book={book} />;
  }
}

HomeTrendingCategoryContainer.propTypes = {
  categories: PropTypes.array.isRequired
};

const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps)(HomeTrendingCategoryContainer);
