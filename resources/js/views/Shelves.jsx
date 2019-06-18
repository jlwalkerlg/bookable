import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Table,
  Media,
  Form,
  Button,
  Dropdown
} from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import URL from '../utils/URL';
import Stars from '../components/Stars';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

class Shelves extends Component {
  state = {
    loading: true,
    shelves: null,
    shelfItems: null,
    count: null,
    limit: 2
  };

  async componentDidMount() {
    const shelves = await this.fetchShelves();
    const shelfId = this.getShelfId();
    const { shelfItems, count } = await this.fetchShelfItems(shelfId);
    this.setState({ shelves, shelfItems, count, loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (this.shelfChanged(prevProps) || this.pageChanged(prevProps)) {
      this.setState({ loading: true });
      const shelfId = this.getShelfId();
      const { shelfItems, count } = await this.fetchShelfItems(shelfId);
      this.setState({ shelfItems, count, loading: false });
    }
  }

  getShelfId() {
    return this.props.match.params.id || null;
  }

  shelfChanged(prevProps) {
    return prevProps.match.params.id !== this.props.match.params.id;
  }

  pageChanged(prevProps) {
    return prevProps.location.search !== this.props.location.search;
  }

  async fetchShelves() {
    try {
      const response = await axios.get('/api/shelves');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchShelfItems(shelfId) {
    const { limit } = this.state;
    const offset = this.calcOffset();
    const params = { limit, offset };
    try {
      const url = shelfId
        ? `/api/shelves/${shelfId}/shelf-items`
        : '/api/shelves/shelf-items';
      const response = await axios.get(url, { params });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  calcOffset() {
    const { limit } = this.state;
    const page = this.getCurrentPage();
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return parseInt(
      URL.query(this.props.location.search).getParam('page') || 1
    );
  }

  calcTotalPages() {
    const { count, limit } = this.state;
    return Math.ceil(count / limit);
  }

  render() {
    const { loading, shelves, shelfItems } = this.state;

    return (
      <div className="section">
        <Container>
          <Row>
            <Col xs={12} lg={3} className="mb-4 mb-md-none">
              <h2 className="h5 text-uppercase">Bookshelves</h2>
              {!shelves ? (
                <Loading />
              ) : (
                <>
                  <ul className="list-unstyled text-secondary d-none d-md-block">
                    <li>
                      <NavLink className="sub-nav-link" to="/shelves" exact>
                        All
                      </NavLink>
                    </li>
                    {shelves.map((shelf, index) => (
                      <li key={index}>
                        <NavLink
                          className="sub-nav-link"
                          to={`/shelves/${shelf.id}`}
                          exact
                        >
                          {shelf.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <Dropdown className="d-block d-md-none w-100">
                    <Dropdown.Toggle variant="info" id="addToShelf">
                      Select a shelf
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {shelves.map((shelf, index) => (
                        <Dropdown.Item
                          key={index}
                          as={NavLink}
                          to={`/shelves/${shelf.id}`}
                          exact
                          className="d-flex justify-content-between align-items-center"
                        >
                          {shelf.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Col>
            <Col xs={12} lg={9}>
              <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <Table responsive className="d-none d-md-table mb-3">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Average Rating</th>
                        <th>Your Rating</th>
                        <th>Date Added</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {shelfItems.map((shelfItem, index) => {
                        const book = shelfItem.book;
                        const author = book.author;

                        return (
                          <tr key={index}>
                            <td>
                              <img
                                src={book.small_image_url}
                                alt={book.title}
                              />
                            </td>
                            <td>
                              <Link to={`/books/${book.id}`}>{book.title}</Link>
                            </td>
                            <td>
                              <Link to={`/authors/${author.id}`}>
                                {author.name}
                              </Link>
                            </td>
                            <td>{book.avg_rating.toFixed(2)}</td>
                            <td className="text-nowrap">
                              <Stars rating={0} />
                            </td>
                            <td>{shelfItem.created_at}</td>
                            <td>
                              <Form
                                action="/"
                                method="POST"
                                onSubmit={this.removeProduct}
                              >
                                <Button
                                  variant="link"
                                  type="submit"
                                  className="text-danger p-0"
                                >
                                  <i className="material-icons">clear</i>
                                </Button>
                              </Form>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div className="d-md-none mb-3">
                    {shelfItems.map((shelfItem, index) => {
                      const book = shelfItem.book;
                      const author = book.author;

                      return (
                        <Media key={index} className="product-table__row py-3">
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="mr-3"
                          />
                          <Media.Body>
                            <p className="h5">
                              <Link to={`/books/${book.id}`}>{book.title}</Link>
                            </p>
                            <p>
                              <span className="text-secondary">by: </span>
                              <Link to={`/authors/${author.id}`}>
                                {author.name}
                              </Link>
                            </p>
                            <p className="font-size-7 mb-2">
                              <span className="text-secondary">
                                Average rating:
                              </span>{' '}
                              {book.avg_rating.toFixed(2)}
                            </p>
                            <p className="font-size-7 mb-2">
                              <span className="text-secondary">
                                Your rating:
                              </span>{' '}
                              <Stars rating={0} />
                            </p>
                            <p className="font-size-7 mb-2">
                              <span className="text-secondary">
                                Date Added:
                              </span>{' '}
                              {shelfItem.created_at}
                            </p>
                            <Form
                              action="/"
                              method="POST"
                              onSubmit={this.removeProduct}
                            >
                              <Button
                                variant="link"
                                type="submit"
                                className="text-danger p-0 font-size-7"
                              >
                                Remove from shelf
                              </Button>
                            </Form>
                          </Media.Body>
                        </Media>
                      );
                    })}
                  </div>
                  <Pagination
                    totalPages={this.calcTotalPages()}
                    currentPage={this.getCurrentPage()}
                    url={`${this.props.location.pathname}?page=`}
                    className="justify-content-center pagination-warning"
                  />
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Shelves.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired
};

export default Shelves;
