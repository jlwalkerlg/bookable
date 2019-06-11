import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';

class Browse extends Component {
  state = {
    inWishlist: false,
    tags: new Array(6).fill(0).map((item, index) => ({
      name: `tag #${index}`,
      checked: false
    }))
  };

  toggleWishlist = e => {
    e.preventDefault();
    this.setState({ inWishlist: !this.state.inWishlist });
  };

  toggleTag = e => {
    const tagName = e.target.dataset.tagName;
    const tags = this.state.tags.map(tag => {
      return tag.name === tagName ? { ...tag, checked: !tag.checked } : tag;
    });
    this.setState({ tags });
  };

  render() {
    const { inWishlist, tags } = this.state;

    return (
      <main className="section">
        <Container>
          <Row>
            <Col xs={12} sm={4} className="mb-4 mb-md-0">
              <h2 className="h5 text-uppercase mb-3">Filter</h2>
              <Form>
                {/* Price */}
                <Form.Row>
                  <Col xs={6} sm={12} lg={6}>
                    <Form.Group controlId="minPrice">
                      <Form.Label>Min Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Min price"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={12} lg={6}>
                    <Form.Group controlId="maxPrice">
                      <Form.Label>Min Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Min price"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>

                {/* Category */}
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select">
                    <option value="philosophy">Philosophy</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="philosophy">Philosophy</option>
                  </Form.Control>
                </Form.Group>

                {/* Tags */}
                <div>
                  <p className="d-inline-block mb-2">Tags</p>
                  <Form.Group className="d-flex flex-wrap">
                    {tags.map((tag, index) => (
                      <div key={index} className="mr-2">
                        <input
                          type="checkbox"
                          className="sr-only"
                          id={`tag_${tag.name}`}
                          onChange={this.toggleTag}
                          data-tag-name={tag.name}
                        />
                        <label
                          htmlFor={`tag_${tag.name}`}
                          className={
                            'tag btn btn-sm rounded-pill ' +
                            (tag.checked ? 'btn-info' : 'btn-outline-info')
                          }
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </Form.Group>
                </div>

                <Button
                  type="submit"
                  variant="warning"
                  className="rounded-pill"
                >
                  Apply Filter
                </Button>
              </Form>
            </Col>
            <Col xs={12} sm={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 text-uppercase mb-2 mb-sm-0">Books</h2>
                <Form>
                  <Form.Group className="mb-0">
                    <Form.Label className="d-inline-block mr-2 font-size-7">
                      Sort by:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="w-auto d-inline-block font-size-7 border-top-0 border-left-0 border-right-0"
                    >
                      <option value="price_asc">Price (asc)</option>
                      <option value="price_desc">Price (desc)</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </div>
              <div className="browse-products mb-4">
                {new Array(20).fill(0).map((item, index) => (
                  <ProductCard
                    key={index}
                    image="https://images.gr-assets.com/books/1329189714l/2165.jpg"
                    title="The Old Man and the Sea"
                    author="Ernest Hemingway"
                    price={15.0}
                    wishlistButton
                    inWishlist={inWishlist}
                    toggleWishlist={this.toggleWishlist}
                  />
                ))}
              </div>
              <Pagination className="justify-content-center pagination-warning">
                {[1, 2, 3, 4].map((page, index) => (
                  <Pagination.Item
                    key={index}
                    active={page === 1}
                    className="text-dark"
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Ellipsis disabled />
                <Pagination.Item>20</Pagination.Item>
              </Pagination>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }
}

export default Browse;
