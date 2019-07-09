import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

class CheckoutFormContainer extends Component {
  state = {
    cardElement: null,
    isProcessing: false,
    values: {
      street_address: '',
      city: '',
      postcode: ''
    },
    validationErrors: {}
  };

  handleReady = cardElement => this.setState({ cardElement });

  handleChange = e => {
    const field = e.target.id;
    const values = { ...this.state.values, [field]: e.target.value };
    this.setState({ values });
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    this.props.onSubmit();

    const {
      paymentMethod,
      error
    } = await this.props.stripe.createPaymentMethod(
      'card',
      this.state.cardElement
    );

    if (error) {
      this.setState({ isProcessing: false });
      this.props.onError(error);
      return;
    }

    try {
      const response = await axios.post('/api/checkout/confirm', {
        payment_method_id: paymentMethod.id,
        ...this.state.values
      });

      this.handleServerResponse(response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors
      ) {
        this.setState({ validationErrors: error.response.data.errors });
        this.props.onError(new Error('Please check your details.'));
      } else {
        this.props.onError(error);
      }
      this.setState({ isProcessing: false });
    }
  };

  handleServerResponse = async response => {
    if (response.error) {
      this.setState({ isProcessing: false });
      return this.props.onError(new Error(response.error));
    }

    if (response.requires_action) {
      const { error, paymentIntent } = await this.props.stripe.handleCardAction(
        response.payment_intent_client_secret
      );

      if (!error) {
        const response = await axios.post('/api/checkout/confirm', {
          payment_intent_id: paymentIntent.id
        });

        return this.handleServerResponse(response.data);
      }

      this.setState({ isProcessing: false });
      return this.props.onError(error);
    }

    return this.props.onSuccess(response);
  };

  render() {
    return (
      <CheckoutForm
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onReady={this.handleReady}
        validationErrors={this.state.validationErrors}
        values={this.state.values}
        isProcessing={this.state.isProcessing}
      />
    );
  }
}

CheckoutFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  stripe: PropTypes.object.isRequired
};

export default injectStripe(CheckoutFormContainer);
