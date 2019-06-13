import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import axios from 'axios';
import MediaQuery from 'react-responsive';
import ProductCard from '../../components/ProductCard';
import URL from '../../utils/URL';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';

class Books extends Component {
  state = {
    loading: true,
    filterOpen: null,
    queryParams: {
      limit: 20,
      offset: 0,
      order_by: 'ratings_desc',
      min_price: '',
      max_price: '',
      min_rating: '',
      max_rating: '',
      min_date: '',
      max_date: ''
    },
    categories: new Array(6).fill(0).map((item, index) => ({
      name: `Category #${index}`,
      checked: false
    })),
    books: null,
    totalBooks: null,
    totalPages: null,
    page: null
  };

  componentDidMount() {
    this.updateParams(this.getBooks);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.updateParams(this.getBooks);
    }
  }

  updateParams(callback) {
    const page = this.getCurrentPage();
    const offset = this.calcOffset(page);
    this.setState(
      { page, queryParams: { ...this.state.queryParams, offset } },
      callback
    );
  }

  getCurrentPage() {
    const queryString = this.props.location.search;
    return parseInt(URL.query(queryString).getParam('page')) || 1;
  }

  calcOffset(page) {
    const { limit } = this.state.queryParams;
    return (page - 1) * limit;
  }

  async getBooks() {
    this.setState({ loading: true });
    const { books, count } = await this.fetchBooks();
    const totalPages = this.calcTotalPages(count, this.state.queryParams.limit);
    this.setState({ books, totalBooks: count, totalPages, loading: false });
  }

  async fetchBooks() {
    const params = this.state.queryParams;
    const response = await axios.get('/api/books', { params });
    return response.data;
  }

  calcTotalPages(totalBooks, perPage) {
    return Math.ceil(totalBooks / perPage);
  }

  handleSortChange = e => {
    this.handleQueryParamChange(e, this.getBooks);
  };

  handleQueryParamChange = (e, callback) => {
    const paramName = e.target.id;
    const value = e.target.value;
    const queryParams = { ...this.state.queryParams, [paramName]: value };
    this.setState({ queryParams }, callback);
  };

  handleFilterSubmit = e => {
    e.preventDefault();
    this.getBooks();
    this.setState({ filterOpen: false });
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

  toggleFilter = () => this.setState({ filterOpen: !this.state.filterOpen });

  render() {
    const {
      categories,
      filterOpen,
      queryParams,
      books,
      totalPages,
      page,
      loading
    } = this.state;

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
                      (filterOpen === true ? 'toggle-collapse-open' : '') +
                      (filterOpen === false ? 'toggle-collapse-close' : '')
                    }
                  >
                    arrow_drop_down
                  </i>
                </button>
              </h2>
              <MediaQuery minWidth={768}>
                {matches => (
                  <Collapse in={filterOpen || matches}>
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
                              onChange={this.handleQueryParamChange}
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
                              onChange={this.handleQueryParamChange}
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
                              onChange={this.handleQueryParamChange}
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
                              onChange={this.handleQueryParamChange}
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
                            onChange={this.handleQueryParamChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="max_date">
                          <Form.Label>Max Date</Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Max date"
                            value={queryParams.max_date}
                            onChange={this.handleQueryParamChange}
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
                      <option value="ratings_desc">Ratings (desc)</option>
                      <option value="ratings_asc">Ratings (asc)</option>
                      <option value="avgrating_desc">Avg Rating (desc)</option>
                      <option value="avgrating_asc">Avg Rating (asc)</option>
                      <option value="price_desc">Price (desc)</option>
                      <option value="price_asc">Price (asc)</option>
                      <option value="date_desc">Date (desc)</option>
                      <option value="date_asc">Date (asc)</option>
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
                        bookId={book.id}
                        image={book.large_image_url || book.image_url}
                        title={book.title}
                        author={book.author}
                        authorId={book.author_id}
                        price={book.price}
                        date={book.publication_date}
                        wishlistButton
                      />
                    ))}
                  </div>
                  <Pagination
                    totalPages={totalPages}
                    currentPage={page}
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

export default Books;
