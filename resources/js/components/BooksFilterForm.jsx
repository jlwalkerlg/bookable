import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import Loading from './Loading';
import CategoryTags from './CategoryTags';
import SubmitButton from './SubmitButton';

const BooksFilterForm = ({
  isLoading,
  error,
  categories,
  min_price,
  max_price,
  min_rating,
  max_rating,
  min_date,
  max_date,
  onChange,
  onSubmit,
  onCategoryChange
}) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <Form action="/" method="GET" onSubmit={onSubmit}>
      {/* Price */}
      <Form.Row>
        <Col xs={6} md={12} lg={6}>
          <Form.Group controlId="min_price">
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Min price"
              min="0"
              step="0.01"
              value={min_price}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={12} lg={6}>
          <Form.Group controlId="max_price">
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Max price"
              min="0"
              step="0.01"
              value={max_price}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>

      {/* Rating */}
      <Form.Row>
        <Col xs={6} md={12} lg={6}>
          <Form.Group controlId="min_rating">
            <Form.Label>Min Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Min rating"
              min="0"
              max="5"
              value={min_rating}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={12} lg={6}>
          <Form.Group controlId="max_rating">
            <Form.Label>Max Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Max rating"
              min="0"
              max="5"
              value={max_rating}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>

      {/* Date */}
      <div>
        <Form.Group controlId="min_date">
          <Form.Label>Min Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Min date"
            value={min_date}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group controlId="max_date">
          <Form.Label>Max Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Max date"
            value={max_date}
            onChange={onChange}
          />
        </Form.Group>
      </div>

      {/* Categories */}
      <div>
        <p className="d-inline-block mb-2">Categories</p>
        <Form.Group className="d-flex flex-wrap">
          <CategoryTags categories={categories} onChange={onCategoryChange} />
        </Form.Group>
      </div>

      {/* Submit */}
      <SubmitButton
        className="rounded-pill"
        variant="warning"
        isLoading={isLoading}
      >
        Apply Filter
      </SubmitButton>
    </Form>
  );
};

BooksFilterForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  categories: PropTypes.array.isRequired,
  min_price: PropTypes.string.isRequired,
  max_price: PropTypes.string.isRequired,
  min_rating: PropTypes.string.isRequired,
  max_rating: PropTypes.string.isRequired,
  min_date: PropTypes.string.isRequired,
  max_date: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default BooksFilterForm;
