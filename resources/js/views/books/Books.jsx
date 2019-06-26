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
    categories: new Array(6).fill(0).map((item, index) => ({
      name: `Category #${index}`,
      checked: false
    })),
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
    loading: true,
    books: null,
    count: null
  };

  componentDidMount() {
    this.fetchBooks();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchBooks();
    }
  }

  fetchBooks = async () => {
    const params = this.getParams();
    this.setState({ loading: true });
    try {
      const response = await axios.get('/api/books', { params });
      const { books, count } = response.data;
      this.setState({ books, count, loading: false, error: null });
    } catch (error) {
      this.setState({ error: error.response.statusText, loading: false });
    }
  };

  getParams() {
    const { queryParams } = this.state;
    const offset = this.calcOffset();

    const params = { offset, count: true };

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
    const [order_by, order_dir] = e.target.value.split('.');
    const queryParams = { ...this.state.queryParams, order_by, order_dir };
    this.setState({ queryParams }, this.getBooks);
  };

  handleFilterChange = e => {
    const paramName = e.target.id;
    const value = e.target.value;
    const queryParams = { ...this.state.queryParams, [paramName]: value };
    this.setState({ queryParams });
  };

  handleFilterSubmit = e => {
    e.preventDefault();
    const { loading } = this.state;
    if (!loading) {
      this.setState({ isFilterOpen: false });
      this.fetchBooks();
    }
  };

  handleCategoryChange = e => {
    const categoryName = e.target.dataset.categoryName;
    const categories = this.state.categories.map(category => {
      return category.name === categoryName
        ? { ...category, checked: !category.checked }
        : category;
    });
    this.setState({ categories });
  };

  render() {
    const {
      categories,
      queryParams,
      books,
      count,
      loading,
      error
    } = this.state;
    const { limit } = queryParams;

    return (
      <main className="section">
        <Container>
          <Row>
            <Col xs={12} md={4} className="mb-4 mb-md-0">
              <FilterForm
                queryParams={queryParams}
                categories={categories}
                onFilterChange={this.handleFilterChange}
                onCategoryChange={this.handleCategoryChange}
                onFilterSubmit={this.handleFilterSubmit}
                loading={loading}
              />
            </Col>
            <Col xs={12} md={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 text-uppercase mb-2 mb-md-0">Books</h2>
                <SortBySelect
                  options={sortOptions}
                  onSortChange={this.handleSortChange}
                />
              </div>
              <Async loading={loading} error={error} retry={this.fetchBooks}>
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
