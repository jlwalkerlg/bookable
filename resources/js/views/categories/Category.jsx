import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
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
    loading: true,
    category: null,
    books: null,
    count: null,
    quotes: null,
    order_by: 'ratings_count',
    order_dir: 'desc',
    limit: 20
  };

  async componentDidMount() {
    try {
      await axios.all([
        this.fetchCategory(),
        this.fetchBooks(),
        this.fetchQuotes()
      ]);
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState({ loading: true });
      await this.fetchBooks();
      this.setState({ loading: false });
    }
  }

  async fetchCategory() {
    const { categoryId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/categories/${categoryId}`);
      this.setState({ category: response.data });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBooks() {
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
    } catch (error) {
      console.log(error);
    }
  }

  async fetchQuotes() {
    const { categoryId } = this.props.match.params;
    try {
      const response = await axios.get('/api/quotes', {
        params: { category_id: categoryId, limit: 10 }
      });
      this.setState({ quotes: response.data.quotes });
    } catch (error) {
      console.log(error);
    }
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

  handleSortChange = e => {
    const [order_by, order_dir] = e.target.value.split('.');
    this.setState({ order_by, order_dir, loading: true }, async () => {
      await this.fetchBooks();
      this.setState({ loading: false });
    });
  };

  render() {
    const {
      loading,
      category,
      books,
      count,
      quotes,
      limit,
      order_by,
      order_dir
    } = this.state;

    if (loading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    const order = `${order_by}.${order_dir}`;

    return (
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
                    onSortChange={this.handleSortChange}
                  />
                </div>
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
              </Col>
              <Col xs={12} md={4}>
                <h2 className="h5 text-uppercase">Quotes in {category.name}</h2>
                <ul className="list-unstyled">
                  {quotes.map((quote, index) => (
                    <li
                      key={index}
                      className="quote mb-3"
                      dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
                    />
                  ))}
                </ul>
                <Link
                  to={`/quotes?category_id=${category.id}`}
                  className="font-weight-bold"
                >
                  Read More
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    );
  }
}

export default Show;
