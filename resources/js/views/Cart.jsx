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
import { removeFromCart } from '../actions/cart';

class Cart extends Component {
  removeFromCart = e => {
    e.preventDefault();
    const bookId = parseInt(e.target.dataset.bookId);
    this.props.removeFromCart(bookId);
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
                  <p>{book.quantity}</p>
                </Col>
                <Col md={3}>
                  <Form
                    action="/"
                    method="POST"
                    data-book-id={book.id}
                    onSubmit={this.removeFromCart}
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
                    data-book-id={book.id}
                    onSubmit={this.removeFromCart}
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
                    <span className="font-weight-bold">{book.quantity}</span>
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
                Subtotal:{' '}
                <span className="font-weight-bold">
                  £
                  {cart
                    .reduce((prev, current) => prev + current.price, 0)
                    .toFixed(2)}
                </span>
              </Card.Text>
              <Button variant="warning">Proceed to checkout</Button>
            </Card.Body>
          </Card>
        </Container>
      </main>
    );
  }
}

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
