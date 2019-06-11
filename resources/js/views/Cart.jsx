import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Media,
  Card
} from 'react-bootstrap';

class Cart extends Component {
  removeProductFromCart = e => {
    e.preventDefault();
    console.log('hi');
  };

  render() {
    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Cart</h1>
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
            {new Array(6).fill(0).map((item, index) => (
              <Row key={index} className="product-table__row">
                <Col md={3}>
                  <Media>
                    <img
                      src="https://images.gr-assets.com/books/1413215930s/656.jpg"
                      alt="War and Peace"
                      className="mr-2"
                    />
                    <Media.Body>
                      <p className="font-display h4">
                        <Link to="/books/1">War and Peace</Link>
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
                  <p>2</p>
                </Col>
                <Col md={3}>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.removeProductFromCart}
                    className="mb-2"
                  >
                    <Button
                      variant="link"
                      type="submit"
                      aria-label="Remove from cart"
                      className="text-danger mr-2"
                    >
                      <i className="material-icons align-top mr-1">clear</i>
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
                <Media.Body className="position-relative">
                  <p className="font-display h4">
                    <Link to="/books/1">War and Peace</Link>
                  </p>
                  <p>
                    <span className="text-secondary">by: </span>
                    <Link to="/">Leo Tolstoy</Link>
                  </p>
                  <p className="text-warning">
                    <span className="text-secondary">Price: </span>
                    £20.00
                  </p>
                  <p className="text-info">
                    <span className="text-secondary">Quantity:</span> 2
                  </p>
                  <Form
                    action="/"
                    method="POST"
                    onSubmit={this.removeProductFromCart}
                    className="mb-2 position-absolute"
                    style={{ right: 0, top: 0 }}
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
                </Media.Body>
              </Media>
            ))}
          </div>
          <Card>
            <Card.Header as="p" className="h5 text-uppercase">
              Checkout
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Total items: <span className="font-weight-bold">3</span>
              </Card.Text>
              <Card.Text>
                Tax: <span className="font-weight-bold">£0.00</span>
              </Card.Text>
              <hr />
              <Card.Text>
                Subtotal: <span className="font-weight-bold">£40.99</span>
              </Card.Text>
              <Button variant="warning">Proceed to checkout</Button>
            </Card.Body>
          </Card>
        </Container>
      </main>
    );
  }
}

export default Cart;
