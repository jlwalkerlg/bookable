import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    const { cart } = this.props;

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
            {cart.map((book, index) => (
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
                  <p>{book.quantity}</p>
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
            {cart.map((book, index) => (
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
                    onSubmit={this.removeProductFromCart}
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
                    <Link to={`/authors/${book.author_id}`}>{book.author}</Link>
                  </p>
                  <p className="text-warning">
                    <span className="text-secondary">Price: </span>
                    £20.00
                  </p>
                  <p className="text-info">
                    <span className="text-secondary">Quantity:</span>{' '}
                    {book.quantity}
                  </p>
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
                Total items:{' '}
                <span className="font-weight-bold">
                  {cart.reduce((prev, current) => prev + current.quantity, 0)}
                </span>
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

const mapStateToProps = ({ user }) => ({
  cart: user.cart
});

export default connect(mapStateToProps)(Cart);
