import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Media } from 'react-bootstrap';
import { removeFromWishlist } from '../actions/wishlist';
import { addToCart, removeFromCart } from '../actions/cart';

class Wishlist extends Component {
  addToCart = (e, book) => {
    e.preventDefault();
    this.props.addToCart(book);
  };

  removeFromCart = (e, id) => {
    e.preventDefault();
    this.props.removeFromCart(id);
  };

  removeFromWishlist = e => {
    e.preventDefault();
    const bookId = parseInt(e.target.dataset.bookId);
    this.props.removeFromWishlist(bookId);
  };

  inCart = id => {
    return !!this.props.cart.filter(book => book.id === id).length;
  };

  render() {
    const { wishlist } = this.props;

    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Wishlist</h1>
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
            {wishlist.map((book, index) => {
              const inCart = this.inCart(book.id);
              const { author } = book;

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
                          <Link to={`/books/${book.id}`}>{book.title}</Link>
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
                    <p>£{book.price.toFixed(2)}</p>
                  </Col>
                  <Col md={3}>
                    <Form
                      action="/"
                      method="POST"
                      onSubmit={
                        inCart
                          ? e => this.removeFromCart(e, book.id)
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
                      data-book-id={book.id}
                      onSubmit={this.removeFromWishlist}
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
            {wishlist.map((book, index) => {
              const inCart = this.inCart(book.id);
              const { author } = book;

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
                      data-book-id={book.id}
                      onSubmit={this.removeFromWishlist}
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
                      <Link to={`/authors/${author.id}`}>{author.name}</Link>
                    </p>
                    <p>£20.00</p>
                    <Form
                      action="/"
                      method="POST"
                      onSubmit={
                        inCart
                          ? e => this.removeFromCart(e, book.id)
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
        </Container>
      </main>
    );
  }
}

Wishlist.propTypes = {
  wishlist: PropTypes.array.isRequired,
  cart: PropTypes.array.isRequired,
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
