import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { Container, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { hydrateCart } from '../actions/cart';

class Checkout extends Component {
  state = {
    error: null
  };

  handleSubmit = () => this.setState({ error: null });

  handleError = error => this.setState({ error });

  handleSuccess = ({ cart, transaction }) => {
    const oldCart = this.props.cart;
    this.props.hydrateCart({ ...cart, items: [] });
    this.props.history.push('/checkout/success', {
      transaction,
      cart: oldCart
    });
  };

  render() {
    const { cart } = this.props;
    if (!cart.items.length) return <Redirect to="/cart" />;

    const { error } = this.state;

    return (
      <StripeProvider apiKey="pk_test_Yz7Xdr8O9u4rnQMYDVdgsu6a">
        <main className="section">
          <Container>
            <h1 className="h4">Checkout</h1>
            {error && (
              <Alert variant="danger">
                Whoops! There was an error. {error}
              </Alert>
            )}
            <Elements>
              <CheckoutForm
                onError={this.handleError}
                onSuccess={this.handleSuccess}
                onSubmit={this.handleSubmit}
              />
            </Elements>
          </Container>
        </main>
      </StripeProvider>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  cart
});

const mapDispatchToProps = {
  hydrateCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout);
