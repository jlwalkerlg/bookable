import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, Spinner, Form, Col } from 'react-bootstrap';
import axios from 'axios';

class CheckoutForm extends Component {
  state = {
    processing: false,
    cardElement: null,
    values: {
      street_address: '',
      city: '',
      postcode: ''
    },
    errors: {}
  };

  handleReady = element => this.setState({ cardElement: element });

  handleChange = e => {
    const field = e.target.id;
    const values = { ...this.state.values, [field]: e.target.value };
    this.setState({ values });
  };

  setErrors(errors) {
    this.setState({ errors, processing: false });
  }

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.processing) return;

    this.setState({ processing: true });
    this.props.onSubmit();

    const {
      paymentMethod,
      error
    } = await this.props.stripe.createPaymentMethod(
      'card',
      this.state.cardElement
    );

    if (error) {
      this.setState({ processing: false });
      this.props.onError(error.message);
    } else {
      try {
        const response = await axios.post('/api/checkout/confirm', {
          payment_method_id: paymentMethod.id,
          ...this.state.values
        });
        this.handleServerResponse(response.data);
      } catch (error) {
        if (error.response.status === 422 && error.response.data.errors) {
          this.setErrors(error.response.data.errors);
          this.props.onError(error.response.data.message);
        } else {
          this.props.onError(error.response.statusText);
        }
      }
    }
  };

  handleServerResponse = async response => {
    if (response.error) {
      console.log(response.error);
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
      this.props.onSuccess(response);
    }
  };

  render() {
    const { values, errors, processing } = this.state;

    return (
      <div>
        <p>Enter your payment details.</p>
        <Form action="" method="POST" onSubmit={this.handleSubmit}>
          {/* Street address */}
          <Form.Group controlId="street_address">
            <Form.Label>Street address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter street address"
              value={values.street_address}
              onChange={this.handleChange}
            />
            {errors.street_address && (
              <Form.Text className="font-size-7 text-danger">
                {errors.street_address[0]}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Row>
            <Col xs={12} sm={6}>
              {/* City */}
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={values.city}
                  onChange={this.handleChange}
                />
                {errors.city && (
                  <Form.Text className="font-size-7 text-danger">
                    {errors.city[0]}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              {/* Post code */}
              <Form.Group controlId="postcode">
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postcode"
                  value={values.postcode}
                  onChange={this.handleChange}
                />
                {errors.postcode && (
                  <Form.Text className="font-size-7 text-danger">
                    {errors.postcode[0]}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Form.Row>
          {/* Card */}
          <Form.Group>
            <Form.Label htmlFor="">Card details</Form.Label>
            <CardElement
              className="form-control d-flex flex-column justify-content-center"
              onReady={this.handleReady}
            />
          </Form.Group>
          {/* Submit */}
          <Button
            variant="warning"
            className="rounded-pill mt-3"
            disabled={processing}
            onClick={this.handleSubmit}
          >
            Submit Payment
            {processing && (
              <Spinner
                className="align-text-bottom ml-2"
                size="sm"
                animation="border"
                role="status"
              />
            )}
          </Button>
        </Form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
