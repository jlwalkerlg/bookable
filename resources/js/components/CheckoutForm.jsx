import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap';
import { CardElement } from 'react-stripe-elements';
import SubmitButton from './SubmitButton';

const CheckoutForm = ({
  onSubmit,
  onChange,
  validationErrors,
  values,
  onReady,
  isProcessing
}) => {
  return (
    <Form action="" method="POST" onSubmit={onSubmit}>
      {/* Street address */}
      <Form.Group controlId="street_address">
        <Form.Label>Street address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter street address"
          value={values.street_address}
          onChange={onChange}
        />
        {validationErrors.street_address && (
          <Form.Text className="font-size-7 text-danger">
            {validationErrors.street_address}
          </Form.Text>
        )}
      </Form.Group>

      <Form.Row>
        {/* City */}
        <Col xs={12} sm={6}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={values.city}
              onChange={onChange}
            />
            {validationErrors.city && (
              <Form.Text className="font-size-7 text-danger">
                {validationErrors.city}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Post code */}
        <Col xs={12} sm={6}>
          <Form.Group controlId="postcode">
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postcode"
              value={values.postcode}
              onChange={onChange}
            />
            {validationErrors.postcode && (
              <Form.Text className="font-size-7 text-danger">
                {validationErrors.postcode}
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
          onReady={onReady}
        />
      </Form.Group>

      <SubmitButton
        variant="warning"
        className="rounded-pull mt-3"
        isLoading={isProcessing}
        onClick={onSubmit}
      >
        Submit Payment
      </SubmitButton>
    </Form>
  );
};

CheckoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  values: PropTypes.shape({
    street_address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    postcode: PropTypes.string.isRequired
  }).isRequired,
  onReady: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

export default CheckoutForm;
