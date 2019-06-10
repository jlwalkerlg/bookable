import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Pagination, Form } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

class Category extends Component {
  render() {
    return (
      <main>
        <header className="section category-head">
          <Container>
            <h1 className="category-head__title">Philosophy</h1>
          </Container>
        </header>
        <div className="section">
          <Container>
            <Row>
              <Col xs={12} md={8} className="mb-4 mb-md-0">
                <div className="d-sm-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 mb-2 mb-sm-0 text-uppercase">
                    Books in Philosophy
                  </h2>
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
                <div className="category-products mb-3">
                  {new Array(20).fill(0).map((item, index) => (
                    <ProductCard
                      key={index}
                      image="https://images.gr-assets.com/books/1390173285l/1381.jpg"
                      title="The Odyssey"
                      author="Homer"
                      price={10.0}
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
              <Col xs={12} md={4}>
                <h2 className="h5 text-uppercase">Quotes in Philosophy</h2>
                <ul className="list-unstyled">
                  <li className="quote mb-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolor quasi a facilis corrupti quo, ipsam quidem! Soluta
                    dolores quibusdam architecto voluptas quis laboriosam
                    reprehenderit perspiciatis reiciendis impedit qui, amet ut.
                  </li>
                  <li className="quote mb-3">
                    Voluptates beatae repudiandae fugiat magnam ad iusto totam
                    illum laudantium minus nemo et, expedita iure eligendi
                    numquam dignissimos voluptatem similique sunt unde,
                    doloremque rerum! Incidunt nobis sint necessitatibus
                    accusantium illum?
                  </li>
                  <li className="quote mb-3">
                    Velit alias sed cum culpa aliquid ab ex, ullam perspiciatis
                    perferendis. Dicta nostrum amet adipisci aperiam dolorem
                    suscipit illum necessitatibus molestias, eius reiciendis!
                    Odit quisquam distinctio adipisci officia, maxime numquam.
                  </li>
                </ul>
                <Link to="/" className="font-weight-bold">
                  Read More
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    );
  }
}

export default Category;
