import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Truncate from './Truncate';

const FeaturedBookMiddle = ({ book, author, heading }) => (
  <Container>
    <Row>
      <Col xs={12} lg={4} className="mb-4 mb-lg-0 text-lg-right">
        <h2 className="heading heading--right-md mb-5">
          <span>{heading}</span>
        </h2>
        <p className="h1 font-display font-weight-bold text-break">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by:</span>{' '}
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>

        <p>
          <span className="text-secondary">Average Rating:</span>{' '}
          {book.avg_rating.toFixed(2)}
        </p>

        <p>
          <span className="text-secondary">Publication Date:</span>{' '}
          {book.publication_date}
        </p>

        <p className="h2 font-weight-bold text-warning">£{book.price}</p>
      </Col>
      <Col xs={12} md={6} lg={4} className="mb-5 mb-md-0">
        <img
          src={book.large_image_url || book.image_url}
          alt={book.title}
          className="d-block mx-auto book-highlight"
        />
      </Col>
      <Col
        xs={12}
        md={6}
        lg={4}
        className="d-flex align-items-end text-md-left"
      >
        <div>
          <Truncate
            html={book.description}
            length={1000}
            className="text-description"
          />
          <Link
            to={`/books/${book.id}`}
            className="btn btn-warning btn-md rounded-pill text-uppercase"
          >
            Read More
          </Link>
        </div>
      </Col>
    </Row>
  </Container>
);

const FeaturedBookLeft = ({ book, author, heading }) => (
  <Container>
    <Row>
      <Col xs={12} md={6} className="offset-md-6">
        <h2 className="heading heading--left-md text-md-left mb-4">
          {heading}
        </h2>
      </Col>
      <Col xs={12} md={6} className="mb-3 mb-md-0 text-md-right">
        <img
          src={book.large_image_url || book.image_url}
          alt={book.title}
          className="book-highlight"
        />
      </Col>
      <Col xs={12} md={6} className="text-md-left">
        <p className="h1 font-display font-weight-bold text-break">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by:</span>{' '}
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>

        <p>
          <span className="text-secondary">Average Rating:</span>{' '}
          {book.avg_rating.toFixed(2)}
        </p>

        <p>
          <span className="text-secondary">Publication Date:</span>{' '}
          {book.publication_date}
        </p>

        <p className="h2 font-weight-bold text-warning mb-4">£{book.price}</p>
        <Truncate
          html={book.description}
          length={1000}
          className="text-description"
        />
        <Link
          to={`/books/${book.id}`}
          className="btn btn-warning btn-md rounded-pill text-uppercase"
        >
          Read More
        </Link>
      </Col>
    </Row>
  </Container>
);

const FeaturedBookRight = ({ book, author, heading }) => (
  <Container>
    <Row>
      <Col xs={12} md={6}>
        <h2 className="heading heading--right-md text-md-right mb-4">
          {heading}
        </h2>
      </Col>
    </Row>
    <Row>
      <Col
        xs={12}
        md={{ span: 6, order: 2 }}
        className="mb-3 mb-md-0 text-md-left"
      >
        <img
          src={book.large_image_url || book.image_url}
          alt={book.title}
          className="book-highlight"
        />
      </Col>
      <Col xs={12} md={{ span: 6, order: 1 }} className="text-md-right">
        <p className="h1 font-display font-weight-bold text-break">
          <Link to="/books/1">{book.title}</Link>
        </p>
        <p>
          <span className="text-secondary">by:</span>{' '}
          <Link to={`/authors/${author.id}`}>{author.name}</Link>
        </p>

        <p>
          <span className="text-secondary">Average Rating:</span>{' '}
          {book.avg_rating.toFixed(2)}
        </p>

        <p>
          <span className="text-secondary">Publication Date:</span>{' '}
          {book.publication_date}
        </p>

        <p className="h2 font-weight-bold text-warning mb-4">£12.00</p>
        <Truncate
          html={book.description}
          length={1000}
          className="text-description text-justify text-md-right"
        />
        <Link
          to={`/books/${book.id}`}
          className="btn btn-warning btn-md rounded-pill text-uppercase"
        >
          Read More
        </Link>
      </Col>
    </Row>
  </Container>
);

const FeaturedBook = ({ book, author, title, variant }) => {
  const heading = typeof title === 'function' ? title() : <span>{title}</span>;

  if (variant === 'left')
    return <FeaturedBookLeft book={book} author={author} heading={heading} />;
  if (variant === 'right')
    return <FeaturedBookRight book={book} author={author} heading={heading} />;
  if (variant === 'middle')
    return <FeaturedBookMiddle book={book} author={author} heading={heading} />;
};

FeaturedBook.propTypes = {
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
};

export default FeaturedBook;
