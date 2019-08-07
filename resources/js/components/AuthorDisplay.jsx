import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Truncate from './Truncate';

const AuthorDisplay = ({ author, books }) => {
  const ratingsCount = books.reduce(
    (carry, book) => carry + book.ratings_count,
    0
  );

  const ratingsSum = books.reduce((carry, book) => carry + book.ratings_sum, 0);

  const avgRating = (ratingsSum / ratingsCount || 0).toFixed(2);

  return (
    <main className="section bg-beige text-center">
      <Container>
        <Row>
          <Col xs={12} md={6} className="text-md-right mb-3 mb-md-0">
            <img src={author.large_image_url} alt={author.name} />
          </Col>
          <Col xs={12} md={6} className="text-md-left">
            <h1 className="font-display">{author.name}</h1>
            {author.birth_date && (
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Born:</span>{' '}
                {author.birth_date}
              </p>
            )}
            {author.death_date && (
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Died:</span>{' '}
                {author.death_date}
              </p>
            )}
            {author.hometown && (
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Hometown:</span>{' '}
                {author.hometown}
              </p>
            )}
            <p className="mb-1 font-size-7">
              <span className="font-weight-bold">Average rating:</span>{' '}
              {avgRating}
            </p>
            <p className="font-size-7">
              <span className="font-weight-bold">Number of ratings:</span>{' '}
              {ratingsCount}
            </p>
            <Truncate
              html={author.about}
              length={1500}
              className="text-description text-justify text-md-left"
            />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

AuthorDisplay.propTypes = {
  author: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired,
};

export default AuthorDisplay;
