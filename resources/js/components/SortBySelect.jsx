import React from 'react';
import { Form } from 'react-bootstrap';

const SortBySelect = ({ options, value, disabled, onSortChange }) => {
  return (
    <Form>
      <Form.Group className="mb-0" controlId="order_by">
        <Form.Label className="d-inline-block mr-2 font-size-7">
          Sort by:
        </Form.Label>
        <Form.Control
          as="select"
          value={value}
          onChange={onSortChange}
          disabled={disabled}
          className="w-auto d-inline-block font-size-7 border-top-0 border-left-0 border-right-0"
        >
          {Object.keys(options).map((key, index) => (
            <option key={index} value={key}>
              {options[key]}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default SortBySelect;
