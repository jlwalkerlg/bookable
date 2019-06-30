import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

class CheckoutForm extends Component {
  state = {
    processing: false,
    cardElement: null
  };

  handleReady = element => this.setState({ cardElement: element });

  handleSubmit = async () => {
    if (this.state.processing) return;

    this.setState({ processing: true });
    this.props.onSubmit();

    const {
      paymentMethod,
      error
    } = await this.props.stripe.createPaymentMethod(
      'card',
      this.state.cardElement,
      {}
    );

    if (error) {
      this.setState({ processing: false });
      this.props.onError(error);
    } else {
      const response = await axios.post('/api/checkout/confirm', {
        payment_method_id: paymentMethod.id
      });
      this.handleServerResponse(response.data);
    }
  };

  handleServerResponse = async response => {
    if (response.error) {
      this.setState({ processing: false });
      this.props.onError(response.error);
    } else if (response.requires_action) {
      const {
        error: errorAction,
        paymentIntent
      } = await this.props.stripe.handleCardAction(
        response.payment_intent_client_secret
      );

      if (errorAction) {
        this.setState({ processing: false });
        this.props.onError(errorAction);
      } else {
        const response = await axios.post('/api/checkout/confirm', {
          payment_intent_id: paymentIntent.id
        });

        this.handleServerResponse(response.data);
      }
    } else {
      this.props.onSuccess();
    }
  };

  render() {
    return (
      <div>
        <p>Enter your payment details.</p>
        <CardElement onReady={this.handleReady} />
        <Button
          variant="warning"
          className="rounded-pill mt-3"
          onClick={this.handleSubmit}
          disabled={this.state.processing}
        >
          Submit Payment
          {this.state.processing && (
            <Spinner
              className="align-text-bottom ml-2"
              size="sm"
              animation="border"
              role="status"
            />
          )}
        </Button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
