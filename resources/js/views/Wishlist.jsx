import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Media } from 'react-bootstrap';

class Wishlist extends Component {
  addProductToCart = e => {
    e.preventDefault();
    console.log('hi');
  };

  removeProductFromWishlist = e => {
    e.preventDefault();
    console.log('hi');
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
            {wishlist.map((book, index) => (
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
                        <Link to={`/authors/${book.author_id}`}>
                          {book.author}
                        </Link>
                      </p>
                    </Media.Body>
                  </Media>
                </Col>
                <Col md={3}>
                  <p>£20.00</p>
                </Col>
                <Col md={3}>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.addProductToCart}
                    className="mb-2"
                  >
                    <Button
                      variant="warning"
                      size="sm"
                      type="submit"
                      className="rounded-pill mr-2"
                    >
                      <i className="material-icons align-top mr-1">
                        add_shopping_cart
                      </i>
                      Add To Cart
                    </Button>
                  </Form>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.removeProductFromWishlist}
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
            ))}
          </div>
          <div className="d-md-none">
            {wishlist.map((book, index) => (
              <Media key={index} className="product-table__row">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="mr-4 mr-md-2"
                />
                <Media.Body>
                  <p className="font-display h4">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </p>
                  <p>
                    <span className="text-secondary">by: </span>
                    <Link to={`/authors/${book.author_id}`}>{book.author}</Link>
                  </p>
                  <p>£20.00</p>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.addProductToCart}
                    className="mb-2"
                  >
                    <Button
                      variant="warning"
                      size="sm"
                      type="submit"
                      className="rounded-pill mr-2"
                    >
                      <i className="material-icons align-top mr-1">
                        add_shopping_cart
                      </i>
                      Add To Cart
                    </Button>
                  </Form>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.removeProductFromWishlist}
                    className="text-secondary"
                  >
                    <Button
                      variant="link"
                      type="submit"
                      className="text-danger font-size-7 px-0"
                    >
                      Remove From Wishlist
                    </Button>
                  </Form>
                </Media.Body>
              </Media>
            ))}
          </div>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  wishlist: user.wishlist
});

export default connect(mapStateToProps)(Wishlist);
