import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import Async from '../../components/Async';
import URL from '../../utils/URL';
import sanitize from '../../utils/sanitize';
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

class Show extends Component {
  state = {
    loading: {
      category: true,
      books: true,
      quotes: true
    },
    errors: {
      category: null,
      books: null,
      quotes: null
    },
    category: null,
    books: null,
    quotes: null,
    count: null,
    order_by: 'ratings_count',
    order_dir: 'desc',
    limit: 20
  };

  componentDidMount() {
    this.fetchCategory();
    this.fetchBooks();
    this.fetchQuotes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchBooks();
    }
  }

  fetchCategory = async () => {
    this.setLoading({ category: true });
    const { categoryId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/categories/${categoryId}`);
      this.setState({ category: response.data });
      this.setError({ category: null });
    } catch (error) {
      this.setError({ category: error.response.statusText });
    }
    this.setLoading({ category: false });
  };

  fetchBooks = async () => {
    this.setLoading({ books: true });
    const { categoryId } = this.props.match.params;
    const { order_by, order_dir, limit } = this.state;
    const offset = this.calcOffset();
    try {
      const response = await axios.get('/api/books', {
        params: {
          with: 'author',
          category_id: categoryId,
          limit,
          offset,
          order_by,
          order_dir,
          count: true
        }
      });
      const { books, count } = response.data;
      this.setState({ books, count });
      this.setError({ books: null });
    } catch (error) {
      this.setError({ books: error.response.statusText });
    }
    this.setLoading({ books: false });
  };

  fetchQuotes = async () => {
    this.setLoading({ quotes: true });
    const { categoryId } = this.props.match.params;
    try {
      const response = await axios.get('/api/quotes', {
        params: { category_id: categoryId, limit: 10 }
      });
      this.setState({ quotes: response.data.quotes });
      this.setError({ quotes: null });
    } catch (error) {
      this.setError({ quotes: error.response.statusText });
    }
    this.setLoading({ quotes: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  calcOffset() {
    const page = this.getCurrentPage();
    const { limit } = this.state;
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return (
      parseInt(URL.query(this.props.location.search).getParam('page')) || 1
    );
  }

  handleSortChange = async e => {
    const { loading } = this.state;
    if (!loading.books) {
      const [order_by, order_dir] = e.target.value.split('.');
      this.setState({ order_by, order_dir }, this.fetchBooks);
    }
  };

  render() {
    const {
      loading,
      errors,
      category,
      books,
      count,
      quotes,
      limit,
      order_by,
      order_dir
    } = this.state;

    const order = `${order_by}.${order_dir}`;

    return (
      <Async
        loading={loading.category}
        error={errors.category}
        retry={this.fetchCategory}
      >
        {() => (
          <main>
            <header className="section category-head">
              <Container>
                <h1 className="category-head__title">{category.name}</h1>
              </Container>
            </header>
            <div className="section">
              <Container>
                <Row>
                  <Col xs={12} md={8} className="mb-4 mb-md-0">
                    <div className="d-sm-flex justify-content-between align-items-center mb-3">
                      <h2 className="h5 mb-2 mb-sm-0 text-uppercase">
                        Books in {category.name}
                      </h2>
                      <SortBySelect
                        options={sortOptions}
                        value={order}
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
                          <div className="category-products mb-3">
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
                            maxPages={5}
                            url={`${this.props.location.pathname}?page=`}
                            className="justify-content-center pagination-warning"
                          />
                        </>
                      )}
                    </Async>
                  </Col>
                  <Col xs={12} md={4}>
                    <h2 className="h5 text-uppercase">
                      Quotes in {category.name}
                    </h2>
                    <Async
                      loading={loading.quotes}
                      error={errors.quotes}
                      retry={this.fetchQuotes}
                    >
                      {() => (
                        <>
                          <ul className="list-unstyled">
                            {quotes.map((quote, index) => (
                              <li
                                key={index}
                                className="quote mb-3"
                                dangerouslySetInnerHTML={sanitize.markup(
                                  quote.quote
                                )}
                              />
                            ))}
                          </ul>
                          <Link
                            to={`/quotes?category_id=${category.id}`}
                            className="font-weight-bold"
                          >
                            Read More
                          </Link>
                        </>
                      )}
                    </Async>
                  </Col>
                </Row>
              </Container>
            </div>
          </main>
        )}
      </Async>
    );
  }
}

export default Show;
