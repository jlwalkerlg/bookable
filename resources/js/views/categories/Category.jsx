import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import URL from '../../utils/URL';

class Show extends Component {
  state = {
    loading: true,
    category: null,
    books: null,
    count: null,
    order_by: 'ratings_count',
    order_dir: 'desc',
    limit: 20
  };

  async componentDidMount() {
    try {
      await axios.all([this.fetchCategory(), this.fetchBooks()]);
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
                  <Form>
                    <Form.Group className="mb-0">
                      <Form.Label className="d-inline-block mr-2 font-size-7">
                        Sort by:
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={order}
                        onChange={this.handleSortChange}
                        className="w-auto d-inline-block font-size-7 border-top-0 border-left-0 border-right-0"
                      >
                        <option value="ratings_count.desc">
                          Ratings (desc)
                        </option>
                        <option value="ratings_count.asc">Ratings (asc)</option>
                        <option value="avg_rating.desc">
                          Avg Rating (desc)
                        </option>
                        <option value="avg_rating.asc">Avg Rating (asc)</option>
                        <option value="price.desc">Price (desc)</option>
                        <option value="price.asc">Price (asc)</option>
                        <option value="publication_date.desc">
                          Date (desc)
                        </option>
                        <option value="publication_date.asc">Date (asc)</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
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
                  <li className="quote mb-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolor quasi a facilis corrupti quo, ipsam quidem! Soluta
                    dolores quibusdam architecto voluptas quis laboriosam
                    reprehenderit perspiciatis reiciendis impedit qui, amet ut.
                  </li>
                  <li className="quote mb-3">
                    Voluptates beatae repudiandae fugiat magnam ad iusto totam
                    illum laudantium minus nemo et, expedita iure eligendi
                    numquam dignissimos voluptatem similique sunt unde,
                    doloremque rerum! Incidunt nobis sint necessitatibus
                    accusantium illum?
                  </li>
                  <li className="quote mb-3">
                    Velit alias sed cum culpa aliquid ab ex, ullam perspiciatis
                    perferendis. Dicta nostrum amet adipisci aperiam dolorem
                    suscipit illum necessitatibus molestias, eius reiciendis!
                    Odit quisquam distinctio adipisci officia, maxime numquam.
                  </li>
                </ul>
                <Link to="/" className="font-weight-bold">
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
