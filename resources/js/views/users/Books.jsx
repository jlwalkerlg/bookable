import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Media,
  Form,
  Button,
  Pagination
} from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import URL from '../../utils/URL';
import Stars from '../../components/Stars';

class Books extends Component {
  state = {
    shelf: null
  };

  componentDidMount() {
    const shelf = this.getShelf(this.props.location.search);
    this.setState({ shelf });
  }

  componentDidUpdate(prevProps) {
    this.updateShelf(prevProps);
  }

  getShelf(queryString) {
    return URL.query(queryString).getParam('shelf') || 'all';
  }

  updateShelf(prevProps) {
    const prevQueryString = prevProps.location.search;
    const queryString = this.props.location.search;
    if (prevQueryString !== queryString) {
      const shelf = this.getShelf(queryString);
      this.setState({ shelf });
    }
  }

  removeProduct = e => {
    e.preventDefault();
    console.log(e.target);
  };

  render() {
    return (
      <div className="section">
        <Container>
          <Row>
            <Col xs={12} lg={3} className="mb-4 mb-md-none">
              <h2 className="h5 text-uppercase">Bookshelves</h2>
              <ul className="list-unstyled text-secondary d-none d-md-block">
                <li>
                  <NavLink to="/user/1/books" exact>
                    All
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/1/books?shelf=read" exact>
                    Read
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/1/books?shelf=to-read" exact>
                    To Read
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/1/books?shelf=reviewed" exact>
                    Reviewed
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/1/books?shelf=rated" exact>
                    Rated
                  </NavLink>
                </li>
              </ul>
              <Form className="d-md-none">
                <Form.Control as="select">
                  <option value="all">All</option>
                  <option value="read">Read</option>
                  <option value="to-read">To Read</option>
                </Form.Control>
              </Form>
            </Col>
            <Col xs={12} lg={9}>
              <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
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
                  {new Array(6).fill(0).map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src="https://images.gr-assets.com/books/1490528560s/4671.jpg"
                          alt="The Great Gatsby"
                        />
                      </td>
                      <td>
                        <Link to="/books/1">The Great Gatsby</Link>
                      </td>
                      <td>
                        <Link to="/author/1">F. Scott Fitzgerald</Link>
                      </td>
                      <td>{(12824793 / 3281503).toFixed(2)}</td>
                      <td className="text-nowrap">
                        <Stars rating={3} />
                      </td>
                      <td>03 Sep 2017</td>
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
                  ))}
                </tbody>
              </Table>
              <div className="d-md-none mb-3">
                {new Array(6).fill(0).map((item, index) => (
                  <Media key={index} className="product-table__row py-3">
                    <img
                      src="https://images.gr-assets.com/books/1490528560m/4671.jpg"
                      alt="The Great Gatsby"
                      className="mr-3"
                    />
                    <Media.Body>
                      <p className="h5">
                        <Link to="/books/1">The Great Gatsby</Link>
                      </p>
                      <p>
                        <span className="text-secondary">by: </span>
                        <Link to="/">F. Scott Fitzgerald</Link>
                      </p>
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">Average rating:</span>{' '}
                        {(12824793 / 3281503).toFixed(2)}
                      </p>
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">Your rating:</span>{' '}
                        <Stars rating={3} />
                      </p>
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">Date Added:</span> 03
                        Sep 2017
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
                ))}
              </div>
              <Pagination className="justify-content-center pagination-warning">
                {[1, 2, 3, 4].map((page, index) => (
                  <Pagination.Item
                    key={index}
                    active={page === 1}
                    className="text-dark"
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Ellipsis disabled />
                <Pagination.Item>20</Pagination.Item>
              </Pagination>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Books;
