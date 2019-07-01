import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Media,
  Card
} from 'react-bootstrap';
import { removeFromCart } from '../actions/cart';
import Async from '../components/Async';

class Cart extends Component {
  state = {
    loading: true,
    error: null,
    items: [],
    count: null
  };

  componentDidMount() {
    const { cart } = this.props;
    if (cart.items.length) {
      this.fetchItems();
    } else {
      this.setState({ loading: false });
    }
  }

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const { cart } = this.props;
      const response = await axios.get(`/api/carts/${cart.id}/items`, {
        params: { with: 'book.author', count: true }
      });
      const { items, count } = response.data;
      this.setState({ items, count, error: null });
    } catch (error) {
      this.setState({ error: error.response.statusText });
    }
    this.setState({ loading: false });
  };

  removeFromCart = (e, book) => {
    e.preventDefault();
    this.props.removeFromCart(book);
    const items = this.state.items.filter(item => item.book_id !== book.id);
    this.setState({ items });
  };

  render() {
    const { loading, error, items } = this.state;

    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Cart</h1>
          <Async loading={loading} error={error} retry={this.fetchItems}>
            {() =>
              !items.length ? (
                <p>
                  There are no items in your cart!{' '}
                  <Link to="/books" className="default">
                    Get shopping!
                  </Link>
                </p>
              ) : (
                <>
                  <div className="product-table d-none d-md-block mb-4">
                    <Row className="product-table__head">
                      <Col md={3}>
                        <p>Product Name</p>
                      </Col>
                      <Col md={3}>
                        <p>Price</p>
                      </Col>
                      <Col md={3}>
                        <p>Quantity</p>
                      </Col>
                      <Col md={3} aria-hidden="true" />
                    </Row>
                    {items.map((item, index) => {
                      const { book } = item;

                      return (
                        <Row key={index} className="product-table__row">
                          <Col md={3}>
                            <Media>
                              <img
                                src={book.small_image_url}
                                alt={book.title}
                                className="mr-2"
                              />
                              <Media.Body>
                                <p className="font-display h4">
                                  <Link to={`/books/${book.id}`}>
                                    {book.title}
                                  </Link>
                                </p>
                                <p>
                                  <span className="text-secondary">by:</span>{' '}
                                  <Link to={`/authors/${book.author.id}`}>
                                    {book.author.name}
                                  </Link>
                                </p>
                              </Media.Body>
                            </Media>
                          </Col>
                          <Col md={3}>
                            <p>£{book.price.toFixed(2)}</p>
                          </Col>
                          <Col md={3}>
                            <p>{item.quantity}</p>
                          </Col>
                          <Col md={3}>
                            <Form
                              action="/"
                              method="POST"
                              data-book-id={book.id}
                              onSubmit={e => this.removeFromCart(e, book)}
                              className="mb-2"
                            >
                              <Button
                                variant="link"
                                type="submit"
                                aria-label="Remove from cart"
                                className="text-danger mr-2"
                              >
                                <i className="material-icons align-top mr-1">
                                  clear
                                </i>
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                  <div className="d-md-none">
                    {items.map((item, index) => {
                      const { book } = item;

                      return (
                        <Media key={index} className="product-table__row">
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="mr-4 mr-md-2"
                          />
                          <Media.Body className="position-relative">
                            <Form
                              action="/"
                              method="POST"
                              data-book-id={book.id}
                              onSubmit={e => this.removeFromCart(e, book)}
                              className="float-right"
                            >
                              <Button
                                variant="link"
                                type="submit"
                                aria-label="Remove from cart"
                                className="text-danger pt-0"
                              >
                                <i className="material-icons">clear</i>
                              </Button>
                            </Form>
                            <p className="font-display h4">
                              <Link to={`/books/${book.id}`}>{book.title}</Link>
                            </p>
                            <p>
                              <span className="text-secondary">by: </span>
                              <Link to={`/authors/${book.author.id}`}>
                                {book.author.name}
                              </Link>
                            </p>
                            <p className="text-warning">
                              <span className="text-secondary">Price:</span> £
                              {book.price.toFixed(2)}
                            </p>
                            <p>
                              <span className="text-secondary">Quantity:</span>{' '}
                              <span className="font-weight-bold">
                                {item.quantity}
                              </span>
                            </p>
                          </Media.Body>
                        </Media>
                      );
                    })}
                  </div>
                  <Card>
                    <Card.Header as="p" className="h5 text-uppercase">
                      Checkout
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        Total items:{' '}
                        <span className="font-weight-bold">
                          {items.reduce(
                            (prev, current) => prev + current.quantity,
                            0
                          )}
                        </span>
                      </Card.Text>
                      <Card.Text>
                        Tax: <span className="font-weight-bold">£0.00</span>
                      </Card.Text>
                      <hr />
                      <Card.Text>
                        Subtotal:{' '}
                        <span className="font-weight-bold">
                          £
                          {items
                            .reduce(
                              (prev, current) =>
                                prev + current.book.price * current.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </Card.Text>
                      <Link to="/checkout" className="btn btn-warning">
                        Proceed to checkout
                      </Link>
                    </Card.Body>
                  </Card>
                </>
              )
            }
          </Async>
        </Container>
      </main>
    );
  }
}

Cart.propTypes = {
  cart: PropTypes.object.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const mapStateToProps = ({ cart }) => ({
  cart
});

const mapDispatchToProps = {
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
