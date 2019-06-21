import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import axios from 'axios';
import MediaQuery from 'react-responsive';
import ProductCard from '../../components/ProductCard';
import URL from '../../utils/URL';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';

class Books extends Component {
  state = {
    categories: new Array(6).fill(0).map((item, index) => ({
      name: `Category #${index}`,
      checked: false
    })),
    loading: true,
    isFilterOpen: null,
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
    books: null,
    count: null
  };

  componentDidMount() {
    this.getBooks();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState({ loading: true });
      this.getBooks();
    }
  }

  async getBooks() {
    try {
      const { books, count } = await this.fetchBooks();
      this.setState({ books, count, loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBooks() {
    const params = this.getParams();
    try {
      const response = await axios.get('/api/books', { params });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

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
    this.setState({ loading: true, isFilterOpen: false });
    this.getBooks();
  };

  toggleCategory = e => {
    const categoryName = e.target.dataset.categoryName;
    const categories = this.state.categories.map(category => {
      return category.name === categoryName
        ? { ...category, checked: !category.checked }
        : category;
    });
    this.setState({ categories });
  };

  toggleFilter = () =>
    this.setState({ isFilterOpen: !this.state.isFilterOpen });

  render() {
    const {
      categories,
      isFilterOpen,
      queryParams,
      books,
      count,
      loading
    } = this.state;
    const { limit } = queryParams;

    return (
      <main className="section">
        <Container>
          <Row>
            <Col xs={12} md={4} className="mb-4 mb-md-0">
              <h2 className="h5 text-uppercase mb-3 d-none d-md-block">
                Filter
              </h2>
              <h2 className="mb-3 d-md-none">
                <button
                  className="btn-reset h5 text-uppercase"
                  aria-label="Toggle filter form"
                  onClick={this.toggleFilter}
                >
                  Filter
                  <i
                    className={
                      'material-icons align-top ' +
                      (isFilterOpen === true ? 'toggle-collapse-open' : '') +
                      (isFilterOpen === false ? 'toggle-collapse-close' : '')
                    }
                  >
                    arrow_drop_down
                  </i>
                </button>
              </h2>
              <MediaQuery minWidth={768}>
                {matches => (
                  <Collapse in={isFilterOpen || matches}>
                    <Form
                      action="/"
                      method="GET"
                      onSubmit={this.handleFilterSubmit}
                    >
                      {/* Price */}
                      <Form.Row>
                        <Col xs={6} md={12} lg={6}>
                          <Form.Group controlId="min_price">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Min price"
                              min="0"
                              step="0.01"
                              value={queryParams.min_price}
                              onChange={this.handleFilterChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={6} md={12} lg={6}>
                          <Form.Group controlId="max_price">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Max price"
                              min="0"
                              step="0.01"
                              value={queryParams.max_price}
                              onChange={this.handleFilterChange}
                            />
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      {/* Rating */}
                      <Form.Row>
                        <Col xs={6} md={12} lg={6}>
                          <Form.Group controlId="min_rating">
                            <Form.Label>Min Rating</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Min rating"
                              min="0"
                              max="5"
                              value={queryParams.min_rating}
                              onChange={this.handleFilterChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={6} md={12} lg={6}>
                          <Form.Group controlId="max_rating">
                            <Form.Label>Max Rating</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Max rating"
                              min="0"
                              max="5"
                              value={queryParams.max_rating}
                              onChange={this.handleFilterChange}
                            />
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      {/* Date */}
                      <div>
                        <Form.Group controlId="min_date">
                          <Form.Label>Min Date</Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Min date"
                            value={queryParams.min_date}
                            onChange={this.handleFilterChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="max_date">
                          <Form.Label>Max Date</Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Max date"
                            value={queryParams.max_date}
                            onChange={this.handleFilterChange}
                          />
                        </Form.Group>
                      </div>

                      {/* Categories */}
                      <div>
                        <p className="d-inline-block mb-2">Categories</p>
                        <Form.Group className="d-flex flex-wrap">
                          {categories.map((category, index) => (
                            <div key={index} className="mr-2">
                              <input
                                type="checkbox"
                                className="sr-only"
                                id={`category_${category.name}`}
                                onChange={this.toggleCategory}
                                data-category-name={category.name}
                              />
                              <label
                                htmlFor={`category_${category.name}`}
                                className={
                                  'tag btn btn-sm rounded-pill ' +
                                  (category.checked
                                    ? 'btn-info'
                                    : 'btn-outline-info')
                                }
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </Form.Group>
                      </div>

                      <Button
                        type="submit"
                        variant="warning"
                        className="rounded-pill"
                      >
                        Apply Filter
                      </Button>
                    </Form>
                  </Collapse>
                )}
              </MediaQuery>
            </Col>
            <Col xs={12} md={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 text-uppercase mb-2 mb-md-0">Books</h2>
                <Form>
                  <Form.Group className="mb-0" controlId="order_by">
                    <Form.Label className="d-inline-block mr-2 font-size-7">
                      Sort by:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      onChange={this.handleSortChange}
                      className="w-auto d-inline-block font-size-7 border-top-0 border-left-0 border-right-0"
                    >
                      <option value="ratings_count.desc">Ratings (desc)</option>
                      <option value="ratings_count.asc">Ratings (asc)</option>
                      <option value="avg_rating.desc">Avg Rating (desc)</option>
                      <option value="avg_rating.asc">Avg Rating (asc)</option>
                      <option value="price.desc">Price (desc)</option>
                      <option value="price.asc">Price (asc)</option>
                      <option value="publication_date.desc">Date (desc)</option>
                      <option value="publication_date.asc">Date (asc)</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </div>
              {loading ? (
                <Loading />
              ) : (
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
