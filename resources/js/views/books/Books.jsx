import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import URL from '../../utils/URL';
import Async from '../../components/Async';
import Pagination from '../../components/Pagination';
import FilterForm from '../../components/FilterForm';
import SortBySelect from '../../components/SortBySelect';

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
    queryParams: {
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
    loading: {
      books: true,
      categories: true
    },
    errors: {
      books: null,
      categories: null
    },
    books: null,
    categories: [],
    count: null,
    isFilterOpen: false
  };

  componentDidMount() {
    this.fetchBooks();
    this.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchBooks();
    }
  }

  fetchBooks = async () => {
    this.setLoading({ books: true });
    const params = this.getParams();
    try {
      const response = await axios.get('/api/books', { params });
      const { books, count } = response.data;
      this.setState({ books, count });
      this.setError({ books: null });
    } catch (error) {
      this.setError({ books: error.response.statusText });
    }
    this.setLoading({ books: false });
  };

  fetchCategories = async () => {
    this.setLoading({ categories: true });
    try {
      const response = await axios.get('/api/categories');
      const categories = response.data.categories.map(category => ({
        ...category,
        checked: false
      }));
      this.setState({ categories });
      this.setError({ categories: null });
    } catch (error) {
      this.setError({ categories: error.response.statusText });
    }
    this.setLoading({ categories: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  getParams() {
    const { queryParams, categories } = this.state;
    const offset = this.calcOffset();
    const categoryIds = categories.reduce(
      (result, category) =>
        category.checked ? [...result, category.id] : result,
      []
    );

    const params = { offset, count: true, category_ids: categoryIds.join(',') };

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params[key] = queryParams[key];
      }
    }

    return params;
  }

  calcOffset() {
    const page = this.getCurrentPage();
    const { limit } = this.state.queryParams;
    return (page - 1) * limit;
  }

  getCurrentPage() {
    const queryString = this.props.location.search;
    return parseInt(URL.query(queryString).getParam('page')) || 1;
  }

  handleSortChange = e => {
    const { loading } = this.state;
    if (!loading.books) {
      const [order_by, order_dir] = e.target.value.split('.');
      const queryParams = { ...this.state.queryParams, order_by, order_dir };
      this.setState({ queryParams }, this.fetchBooks);
    }
  };

  handleFilterChange = e => {
    const paramName = e.target.id;
    const value = e.target.value;
    const queryParams = { ...this.state.queryParams, [paramName]: value };
    this.setState({ queryParams });
  };

  handleFilterSubmit = async e => {
    e.preventDefault();
    const { loading } = this.state;
    if (!loading.books) {
      const shouldFetch = !URL.query(this.props.location.search).getParam(
        'page'
      );
      this.props.history.push('/books');
      if (shouldFetch) this.fetchBooks();
    }
  };

  handleCategoryChange = e => {
    const categoryId = parseInt(e.target.dataset.categoryId);
    const categories = this.state.categories.map(category => {
      return category.id === categoryId
        ? { ...category, checked: !category.checked }
        : category;
    });
    this.setState({ categories });
  };

  render() {
    const {
      queryParams,
      books,
      categories,
      count,
      loading,
      errors
    } = this.state;
    const { limit } = queryParams;

    return (
      <main className="section">
        <Container>
          <Row>
            <Col xs={12} md={4} className="mb-4 mb-md-0">
              <Async
                loading={loading.categories}
                error={errors.categories}
                retry={this.fetchCategories}
              >
                {() => (
                  <FilterForm
                    queryParams={queryParams}
                    categories={categories}
                    onFilterChange={this.handleFilterChange}
                    onCategoryChange={this.handleCategoryChange}
                    onFilterSubmit={this.handleFilterSubmit}
                    loading={loading.books}
                  />
                )}
              </Async>
            </Col>
            <Col xs={12} md={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 text-uppercase mb-2 mb-md-0">Books</h2>
                <SortBySelect
                  options={sortOptions}
                  disabled={loading.books}
                  onSortChange={this.handleSortChange}
                />
              </div>
              <Async
                loading={loading.books}
                error={errors.books}
                retry={this.fetchBooks}
              >
                {() => (
                  <>
                    <div className="browse-products mb-4">
                      {books.map((book, index) => (
                        <ProductCard
                          key={index}
                          book={book}
                          size="large"
                          wishlistButton
                        />
                      ))}
                    </div>
                    <Pagination
                      totalItems={count}
                      currentPage={this.getCurrentPage()}
                      pageSize={limit}
                      url="/books?page="
                      className="justify-content-center pagination-warning"
                    />
                  </>
                )}
              </Async>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }
}

Books.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
};

export default Books;
