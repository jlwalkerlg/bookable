import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Truncate from './Truncate';
import BookUserActionsContainer from './BookUserActionsContainer';

const BookDisplay = ({ book, user }) => {
  const { author, categories } = book;

  return (
    <main className="section bg-beige">
      <Container>
        <Row>
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            {/* Book Cover Image */}
            <img
              src={book.large_image_url || book.image_url}
              alt={book.title}
              className="d-block mx-auto mr-md-0 book-highlight"
            />

            {/* User Rating */}
            {/* {user.id && (
              <div className="text-center mt-3">
                <p>
                  Your rating:
                  <Stars
                    className={`ml-2${
                      processing.userRating ? ' disabled' : ''
                    }`}
                    editable={!processing.userRating}
                    onClick={
                      userRating
                        ? e => this.handleUpdateRating(e, userRating)
                        : e => this.addRating(e, book)
                    }
                    rating={(userRating && userRating.rating) || 0}
                  />
                </p>
              </div>
            )} */}
          </Col>

          <Col xs={12} md={8} className="text-center text-md-left">
            {/* Book title */}
            <h1 className="h1 font-display font-weight-bold">{book.title}</h1>
            <p>
              <span className="text-secondary">by: </span>
              <Link to={`/authors/${author.id}`}>{author.name}</Link>
            </p>

            {/* Book description */}
            <Truncate
              html={book.description}
              length={1000}
              btnClassName="font-size-7"
              className="text-description"
            />

            {/* Book categories */}
            <div>
              <span className="text-secondary">Categories: </span>
              {categories.length ? (
                categories.map((category, index) => (
                  <React.Fragment key={index}>
                    {index !== 0 && ', '}
                    <Link to={`/category/${category.id}`}>{category.name}</Link>
                  </React.Fragment>
                ))
              ) : (
                <p className="font-size-7 text-secondary">
                  No categories to show.
                </p>
              )}
            </div>

            {/* Book price */}
            <p className="font-weight-bold h2 mt-3">£{book.price}</p>

            {user.id && <BookUserActionsContainer book={book} />}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default BookDisplay;
