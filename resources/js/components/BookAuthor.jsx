import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Truncate from './Truncate';
import BookCarousel from './BookCarousel';

const BookAuthor = ({ author }) => {
  const { books } = author;

  return (
    <>
      <article className="section bg-beige text-center">
        <Container>
          <Row>
            <Col xs={12} md={8} className="offset-md-4 text-md-left">
              <h2 className="heading heading--left-md mb-4">
                <span>About The Author</span>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4} className="text-md-right mb-4 mb-md-0">
              <img src={author.image_url} alt={author.name} />
            </Col>
            <Col xs={12} md={8} className="text-md-left">
              <Truncate html={author.about} length={1000} />
              <p className="font-weight-bold mt-3">
                <Link to={`/authors/${author.id}`}>View Author</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </article>

      <article className="section text-center">
        <Container>
          <h2 className="heading mb-4">
            <span>Other Books by</span>{' '}
            <Link to={`/authors/${author.id}`}>{author.name}</Link>
          </h2>
          {books.length ? (
            <BookCarousel books={books} />
          ) : (
            <p>No books to show.</p>
          )}
        </Container>
      </article>
    </>
  );
};

export default BookAuthor;
