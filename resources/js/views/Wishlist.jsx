import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Media } from 'react-bootstrap';
import { removeFromWishlist } from '../actions/wishlist';
import { addToCart, removeFromCart } from '../actions/cart';
import Async from '../components/Async';

class Wishlist extends Component {
  state = {
    loading: true,
    error: null,
    items: null,
    count: null
  };

  async componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const { wishlist } = this.props;
      const response = await axios.get(`/api/wishlists/${wishlist.id}/items`, {
        params: { with: 'book.author', count: true }
      });
      const { items, count } = response.data;
      this.setState({ items, count, error: null });
    } catch (error) {
      this.setState({ error: error.response.statusText });
    }
    this.setState({ loading: false });
  };

  addToCart = (e, book) => {
    e.preventDefault();
    this.props.addToCart(book);
  };

  removeFromCart = (e, book) => {
    e.preventDefault();
    this.props.removeFromCart(book);
  };

  removeFromWishlist = (e, book) => {
    e.preventDefault();
    this.props.removeFromWishlist(book);
    const items = this.state.items.filter(item => item.book_id !== book.id);
    this.setState({ items });
  };

  inCart = bookId => {
    const { items } = this.props.cart;
    return items && !!items.filter(item => item.book_id === bookId).length;
  };

  render() {
    const { loading, error, items } = this.state;

    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Wishlist</h1>
          <Async loading={loading} error={error} retry={this.fetchItems}>
            {() => (
              <>
                <div className="product-table d-none d-md-block">
                  <Row className="product-table__head">
                    <Col md={6}>
                      <p>Product Name</p>
                    </Col>
                    <Col md={3}>
                      <p>Price</p>
                    </Col>
                    <Col md={3} aria-hidden="true" />
                  </Row>
                  {items.map((item, index) => {
                    const { book } = item;
                    const { author } = book;
                    const inCart = this.inCart(book.id);

                    return (
                      <Row key={index} className="product-table__row">
                        <Col md={6}>
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
                                <span className="text-secondary">by: </span>
                                <Link to={`/authors/${author.id}`}>
                                  {author.name}
                                </Link>
                              </p>
                            </Media.Body>
                          </Media>
                        </Col>
                        <Col md={3}>
                          <p>£{book.price}</p>
                        </Col>
                        <Col md={3}>
                          <Form
                            action="/"
                            method="POST"
                            onSubmit={
                              inCart
                                ? e => this.removeFromCart(e, book)
                                : e => this.addToCart(e, book)
                            }
                            className="mb-2"
                          >
                            <Button
                              variant="warning"
                              size="sm"
                              type="submit"
                              className="rounded-pill mr-2"
                            >
                              <i className="material-icons align-top mr-1">
                                {inCart
                                  ? 'remove_shopping_cart'
                                  : 'add_shopping_cart'}
                              </i>
                              {inCart ? 'Remove From Cart' : 'Add To Cart'}
                            </Button>
                          </Form>
                          <Form
                            action="/"
                            method="POST"
                            onSubmit={e => this.removeFromWishlist(e, book)}
                            className="text-secondary"
                          >
                            <Button
                              variant="link"
                              type="submit"
                              className="text-danger font-size-7"
                            >
                              Remove From Wishlist
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
                    const { author } = book;
                    const inCart = this.inCart(book.id);

                    return (
                      <Media key={index} className="product-table__row">
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="mr-4 mr-md-2"
                        />
                        <Media.Body>
                          <Form
                            action="/"
                            method="POST"
                            onSubmit={e => this.removeFromWishlist(e, book)}
                            className="float-right"
                          >
                            <Button
                              variant="link"
                              type="submit"
                              aria-label="Remove from wishlist"
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
                            <Link to={`/authors/${author.id}`}>
                              {author.name}
                            </Link>
                          </p>
                          <p>£{book.price}</p>
                          <Form
                            action="/"
                            method="POST"
                            onSubmit={
                              inCart
                                ? e => this.removeFromCart(e, book)
                                : e => this.addToCart(e, book)
                            }
                            className="mb-2"
                          >
                            <Button
                              variant="warning"
                              size="sm"
                              type="submit"
                              className="rounded-pill mr-2"
                            >
                              <i className="material-icons align-top mr-1">
                                {inCart
                                  ? 'remove_shopping_cart'
                                  : 'add_shopping_cart'}
                              </i>
                              {inCart ? 'Remove From Cart' : 'Add To Cart'}
                            </Button>
                          </Form>
                        </Media.Body>
                      </Media>
                    );
                  })}
                </div>
              </>
            )}
          </Async>
        </Container>
      </main>
    );
  }
}

Wishlist.propTypes = {
  wishlist: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const mapStateToProps = ({ wishlist, cart }) => ({
  wishlist,
  cart
});

const mapDispatchToProps = {
  removeFromWishlist,
  addToCart,
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wishlist);
