import React, { Component } from 'react';
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
            {new Array(6).fill(0).map((item, index) => (
              <Row key={index} className="product-table__row">
                <Col md={6}>
                  <Media>
                    <img
                      src="https://images.gr-assets.com/books/1413215930s/656.jpg"
                      alt="War and Peace"
                      className="mr-2"
                    />
                    <Media.Body>
                      <p className="font-display h4">
                        <Link to="/books/show">War and Peace</Link>
                      </p>
                      <p>
                        <span className="text-secondary">by: </span>
                        <Link to="/">Leo Tolstoy</Link>
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
                      size="sm"
                      type="submit"
                      className="text-danger"
                    >
                      <i className="material-icons align-top mr-1">clear</i>
                      Remove
                    </Button>
                  </Form>
                </Col>
              </Row>
            ))}
          </div>
          <div className="d-md-none">
            {new Array(6).fill(0).map((item, index) => (
              <Media key={index} className="product-table__row">
                <img
                  src="https://images.gr-assets.com/books/1413215930m/656.jpg"
                  alt="War and Peace"
                  className="mr-4 mr-md-2"
                />
                <Media.Body>
                  <p className="font-display h4">
                    <Link to="/books/show">War and Peace</Link>
                  </p>
                  <p>
                    <span className="text-secondary">by: </span>
                    <Link to="/">Leo Tolstoy</Link>
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
                      size="sm"
                      type="submit"
                      className="text-danger"
                    >
                      <i className="material-icons align-top mr-1">clear</i>
                      Remove
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

export default Wishlist;
