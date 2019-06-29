import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, Spinner } from 'react-bootstrap';

class CheckoutForm extends Component {
  state = {
    processing: false,
    cardElement: null
  };

  handleSubmit = async () => {
    if (this.state.processing) return;

    this.setState({ processing: true });
    this.props.onSubmit();

    const { paymentIntent, error } = await this.props.stripe.handleCardPayment(
      this.props.intentSecret,
      this.state.cardElement,
      {}
    );

    this.setState({ processing: false });

    if (error) {
      this.props.onError(error.message);
    } else {
      this.props.onSuccess();
    }
  };

  handleReady = element => this.setState({ cardElement: element });

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
