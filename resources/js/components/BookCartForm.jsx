import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const BookCartForm = ({
  quantity,
  onChange,
  isInCart,
  addToCart,
  removeFromCart,
}) => {
  return (
    <Form
      action="/"
      method="POST"
      className="mb-3"
      onSubmit={isInCart ? removeFromCart : addToCart}
    >
      {/* Quantity */}
      {!isInCart && (
        <div className="d-inline-block mr-3">
          <Form.Group controlId="quantity">
            <Form.Label className="text-description mb-0 d-inline-block mb-2">
              Quantity:
            </Form.Label>
            <Form.Control
              type="number"
              className="rounded-pill bg-transparent w-auto"
              value={quantity}
              min="1"
              onChange={onChange}
              size="sm"
            />
          </Form.Group>
        </div>
      )}

      {/* Submit button */}
      <div className="d-inline-block">
        <Button variant="warning" type="submit" className="rounded-pill">
          <i className="material-icons align-top mr-1">
            {isInCart ? 'remove_shopping_cart' : 'add_shopping_cart'}
          </i>
          {isInCart ? 'Remove From Cart' : 'Add To Cart'}
        </Button>
      </div>
    </Form>
  );
};

BookCartForm.propTypes = {
  quantity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isInCart: PropTypes.bool.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default BookCartForm;
