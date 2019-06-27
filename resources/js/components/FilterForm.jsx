import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Col, Form, Button, Collapse, Spinner } from 'react-bootstrap';

class FilterForm extends Component {
  state = {
    isFilterOpen: false
  };

  toggleFilter = () =>
    this.setState({ isFilterOpen: !this.state.isFilterOpen });

  handleFilterSubmit = e => {
    this.setState({ isFilterOpen: false });
    this.props.onFilterSubmit(e);
  };

  render() {
    const {
      queryParams,
      categories,
      onFilterChange,
      onCategoryChange,
      loading
    } = this.props;
    const { isFilterOpen } = this.state;

    return (
      <>
        <h2 className="h5 text-uppercase mb-3 d-none d-md-block">Filter</h2>
        <h2 className="mb-3 d-md-none">
          <button
            className="btn-reset h5 text-uppercase"
            aria-label="Toggle filter form"
            onClick={this.toggleFilter}
          >
            Filter
            <i
              className={
                'material-icons align-top ' +
                (isFilterOpen === true ? 'toggle-collapse-open' : '') +
                (isFilterOpen === false ? 'toggle-collapse-close' : '')
              }
            >
              arrow_drop_down
            </i>
          </button>
        </h2>
        <MediaQuery minWidth={768}>
          {matches => (
            <Collapse in={isFilterOpen || matches}>
              <Form action="/" method="GET" onSubmit={this.handleFilterSubmit}>
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
                        value={queryParams.min_price}
                        onChange={onFilterChange}
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
                        value={queryParams.max_price}
                        onChange={onFilterChange}
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
                        value={queryParams.min_rating}
                        onChange={onFilterChange}
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
                        value={queryParams.max_rating}
                        onChange={onFilterChange}
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
                      value={queryParams.min_date}
                      onChange={onFilterChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="max_date">
                    <Form.Label>Max Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Max date"
                      value={queryParams.max_date}
                      onChange={onFilterChange}
                    />
                  </Form.Group>
                </div>

                {/* Categories */}
                <div>
                  <p className="d-inline-block mb-2">Categories</p>
                  <Form.Group className="d-flex flex-wrap">
                    {categories.map((category, index) => (
                      <div key={index} className="mr-2">
                        <input
                          type="checkbox"
                          className="sr-only"
                          id={`category_${category.name}`}
                          onChange={onCategoryChange}
                          data-category-id={category.id}
                        />
                        <label
                          htmlFor={`category_${category.name}`}
                          className={
                            'tag btn btn-sm rounded-pill ' +
                            (category.checked ? 'btn-info' : 'btn-outline-info')
                          }
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </Form.Group>
                </div>

                <Button
                  type="submit"
                  variant="warning"
                  className="rounded-pill"
                  disabled={loading}
                >
                  Apply Filter
                  {loading && (
                    <Spinner
                      className="align-text-bottom ml-2"
                      size="sm"
                      animation="border"
                      role="status"
                    />
                  )}
                </Button>
              </Form>
            </Collapse>
          )}
        </MediaQuery>
      </>
    );
  }
}

export default FilterForm;
