import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { Container, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CheckoutFormContainer from '../components/CheckoutFormContainer';
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
    if (!this.props.cart.items.length) return <Redirect to="/cart" />;

    const { error } = this.state;

    return (
      <StripeProvider apiKey="pk_test_Yz7Xdr8O9u4rnQMYDVdgsu6a">
        <main className="section">
          <Container>
            {error && (
              <Alert variant="danger">
                Whoops! There was an error. {error.message}
              </Alert>
            )}

            <h1 className="h4">Checkout</h1>

            <p className="font-size-5">Enter your payment details.</p>

            <Elements>
              <CheckoutFormContainer
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

Checkout.propTypes = {
  cart: PropTypes.object.isRequired,
  hydrateCart: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

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
