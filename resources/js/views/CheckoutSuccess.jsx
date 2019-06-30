import React, { Component } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Async from '../components/Async';

class CheckoutSuccess extends Component {
  state = {
    loading: true,
    items: []
  };

  componentDidMount() {
    const cart = this.props.location.state && this.props.location.state.cart;
    if (!cart) {
      this.setState({ loading: false });
    } else {
      this.fetchItems();
    }
  }

  fetchItems = async () => {
    this.setState({ loading: true });
    const { cart } = this.props.location.state;
    try {
      const response = await axios.get(`/api/carts/${cart.id}/items`, {
        params: { with: 'book' }
      });
      const { items } = response.data;
      this.setState({ items, error: null });
    } catch (error) {
      this.setState({ error: error.response.statusText });
    }
    this.setState({ loading: false });
  };

  render() {
    const { location } = this.props;
    const transaction = location.state && location.state.transaction;
    if (!transaction) return <Redirect to="/cart" />;

    const { loading, error, items } = this.state;

    return (
      <main className="section">
        <Container>
          <Alert variant="success">
            Payment of £{(transaction.amount / 100).toFixed(2)} successful!
          </Alert>
          <p>
            A confirmation email will be sent to {transaction.email} shortly.
          </p>
          <p>
            Your order will be shipped to {transaction.street_address},{' '}
            {transaction.city}, {transaction.postcode}
          </p>
          <div>
            <p>Order:</p>
            <Async loading={loading} error={error} retry={this.fetchItems}>
              {() => {
                return (
                  <ul className="list-unstyled">
                    {items.map(item => {
                      const { book } = item;
                      return (
                        <li key={item.id} className="card">
                          <p>Title: {book.title}</p>
                          <p>Price: £{book.price}</p>
                          <p>Quantity: {item.quantity}</p>
                        </li>
                      );
                    })}
                  </ul>
                );
              }}
            </Async>
          </div>
        </Container>
      </main>
    );
  }
}

export default CheckoutSuccess;
