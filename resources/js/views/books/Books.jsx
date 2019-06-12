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
    inWishlist: false,
    categories: new Array(6).fill(0).map((item, index) => ({
      name: `Category #${index}`,
      checked: false
    })),
    filterOpen: null,
    page: 1,
    limit: 20,
    books: null,
    totalBooks: 0,
    totalPages: 1,
    loading: true
  };

  async componentDidMount() {
    const page = this.getCurrentPage();
    this.setState({ page });
    const { books, total } = await this.fetchBooks(page);
    const totalPages = this.getTotalPages(total);
    this.setState({ books, totalBooks: total, totalPages, loading: false });
  }

  async fetchBooks() {
    const limit = this.state.limit;
    const offset = this.getCurrentOffset();
    const url =
      `api/books?limit=${limit}` + (offset ? `&offset=${offset}` : '');
    const response = await axios.get(url);
    return response.data;
  }

  getCurrentPage() {
    const queryString = this.props.location.search;
    return URL.query(queryString).getParam('page') || 1;
  }

  getCurrentOffset() {
    const page = this.getCurrentPage();
    const limit = this.state.limit;
    return (page - 1) * limit;
  }

  getTotalPages(totalBooks) {
    const limit = this.state.limit;
    const total = totalBooks || this.state.totalBooks;
    return Math.ceil(total / limit);
  }

  toggleWishlist = e => {
    e.preventDefault();
    this.setState({ inWishlist: !this.state.inWishlist });
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

  handleFilterSubmit = e => {
    e.preventDefault();
    this.setState({ filterOpen: false });
  };

  render() {
    const {
      inWishlist,
      categories,
      filterOpen,
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
                          <Form.Group controlId="minPrice">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Min price"
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={6} md={12} lg={6}>
                          <Form.Group controlId="maxPrice">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Min price"
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Form.Row>

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
                  <Form.Group className="mb-0">
                    <Form.Label className="d-inline-block mr-2 font-size-7">
                      Sort by:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="w-auto d-inline-block font-size-7 border-top-0 border-left-0 border-right-0"
                    >
                      <option value="price_asc">Price (asc)</option>
                      <option value="price_desc">Price (desc)</option>
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
                        price={15.0}
                        wishlistButton
                        inWishlist={inWishlist}
                        toggleWishlist={this.toggleWishlist}
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
