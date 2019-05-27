import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => (
  <Container>
    <Row className="align-items-center fullheight-with-nav">
      <Col className="text-center">
        <h1 className="display-4">Welcome to Bookable</h1>
        <p className="h4 font-weight-light mb-3">
          Meet your new favourite book.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </Col>
    </Row>
  </Container>
);

export default Home;
