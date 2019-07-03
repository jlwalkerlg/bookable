import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import URL from '../../utils/URL';
import SortBySelect from '../../components/SortBySelect';
import BooksFilterFormContainer from '../../components/BooksFilterFormContainer';
import BooksResults from '../../components/BooksResults';
import withPagination from '../../components/withPagination';

const sortOptions = {
  'ratings_count.desc': 'Ratings (desc)',
  'ratings_count.asc': 'Ratings (asc)',
  'avg_rating.desc': 'Avg Rating (desc)',
  'avg_rating.asc': 'Avg Rating (asc)',
  'price.desc': 'Price (desc)',
  'price.asc': 'Price (asc)',
  'publication_date.desc': 'Date (desc)',
  'publication_date.asc': 'Date (asc)'
};

class Books extends Component {
  state = {
    isLoadingBooks: true,
    isLoadingCategories: true,
    errorCategories: null,
    errorBooks: null,
    params: {
      limit: 20,
      order_by: 'ratings_count',
      order_dir: 'desc',
      min_price: '',
      max_price: '',
      min_rating: '',
      max_rating: '',
      min_date: '',
      max_date: ''
    },
    categories: [],
    books: [],
    count: 0
  };

  componentDidMount() {
    this.fetchBooks();
    this.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.fetchBooks();
    }
  }

  fetchBooks = async () => {
    this.setState({ isLoadingBooks: true });

    const params = this.collectParams();

    try {
      const response = await axios.get('/api/books', { params });
      const { books, count } = response.data;
      this.setState({ books, count, isLoadingBooks: false });
    } catch (error) {
      this.setState({ errorBooks: error, isLoadingBooks: false });
    }
  };

  async fetchCategories() {
    try {
      const response = await axios.get('/api/categories');
      const categories = response.data.categories.map(category => ({
        ...category,
        checked: false
      }));
      this.setState({ categories, isLoadingCategories: false });
    } catch (error) {
      this.setState({ errorCategories: error, isLoadingCategories: false });
    }
  }

  collectParams() {
    const { params, categories } = this.state;

    const categoryIds = categories.reduce(
      (result, category) =>
        category.checked ? [...result, category.id] : result,
      []
    );

    const result = {
      offset: this.props.calcOffset(params.limit),
      count: true
    };

    if (categoryIds.length) {
      result.category_ids = categoryIds.join(',');
    }

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        result[key] = params[key];
      }
    }

    return result;
  }

  handleFilterSubmit = async () => {
    if (this.state.isLoadingBooks) return;

    const shouldFetch = !URL.query(this.props.location.search).getParam('page');
    this.props.history.push('/books');
    if (shouldFetch) this.fetchBooks();
  };

  handleFilterChange = e => {
    this.setState({
      params: { ...this.state.params, [e.target.id]: e.target.value }
    });
  };

  handleCategoryChange = e => {
    const categoryId = parseInt(e.target.dataset.categoryId);
    this.setState({
      categories: this.state.categories.map(category => {
        return category.id === categoryId
          ? { ...category, checked: !category.checked }
          : category;
      })
    });
  };

  handleSortChange = e => {
    if (this.state.isLoadingBooks) return;

    const [order_by, order_dir] = e.target.value.split('.');
    const params = { ...this.state.params, order_by, order_dir };
    this.setState({ params }, this.fetchBooks);
  };

  render() {
    const {
      isLoadingBooks,
      isLoadingCategories,
      errorBooks,
      errorCategories,
      books,
      count,
      categories,
      params
    } = this.state;
    const { limit } = params;
    const { page } = this.props;

    return (
      <div className="section">
        <Container>
          <Row>
            <Col xs={12} md={4} className="mb-4 mb-md-0">
              <BooksFilterFormContainer
                isLoading={isLoadingCategories}
                error={errorCategories}
                categories={categories}
                params={params}
                onSubmit={this.handleFilterSubmit}
                onChange={this.handleFilterChange}
                onCategoryChange={this.handleCategoryChange}
              />
            </Col>
            <Col xs={12} md={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 text-uppercase mb-2 mb-md-0">Books</h2>
                <SortBySelect
                  options={sortOptions}
                  disabled={isLoadingBooks}
                  onChange={this.handleSortChange}
                />
              </div>
              <BooksResults
                isLoading={isLoadingBooks}
                error={errorBooks}
                books={books}
                count={count}
                page={page}
                limit={limit}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Books.propTypes = {
  page: PropTypes.number.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withPagination(Books);
