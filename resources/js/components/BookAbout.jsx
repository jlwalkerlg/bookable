import React from 'react';
import BookQuotes from './BookQuotes';
import { Container, Row, Col } from 'react-bootstrap';
import Scrollspy from 'react-scrollspy';
import sanitize from '../utils/sanitize';

const BookAbout = ({ book, quotes, isLoadingQuotes, errorQuotes }) => {
  return (
    <article className="section">
      <Container>
        <Row>
          {/* Menu */}
          <Col xs={12} md={4} className="d-none d-md-block text-right">
            <div className="sticky-top mb-3">
              <h2 className="heading heading--right-md mb-4">
                <span>About This Book</span>
              </h2>
              <Scrollspy
                items={['overview', 'details', 'quotes']}
                currentClassName="active font-weight-bold"
                className="list-unstyled text-uppercase font-weight-light scrollspy"
              >
                <li className="mb-2">
                  <a href="#overview" className="scrollspy__link">
                    Overview
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#details" className="scrollspy__link">
                    Details
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#quotes" className="scrollspy__link">
                    Quotes
                  </a>
                </li>
              </Scrollspy>
            </div>
          </Col>

          {/* Book details */}
          <Col xs={12} md={8} className="font-serif font-size-7">
            <section id="overview" className="mb-4">
              <h3 className="text-uppercase font-size-6">Overview</h3>
              <p dangerouslySetInnerHTML={sanitize.markup(book.description)} />
            </section>
            <section id="details" className="mb-4">
              <h3 className="text-uppercase font-size-6">Details</h3>
              <ul className="list-unstyled">
                <li>
                  <span className="font-weight-bold">Publisher:</span>{' '}
                  {book.publisher}
                </li>
                <li>
                  <span className="font-weight-bold">Publish Date:</span>{' '}
                  {book.publication_date}
                </li>
                <li>
                  <span className="font-weight-bold">Page Count:</span>{' '}
                  {book.num_pages}
                </li>
              </ul>
            </section>
            <BookQuotes
              book={book}
              quotes={quotes}
              isLoading={isLoadingQuotes}
              error={errorQuotes}
            />
          </Col>
        </Row>
      </Container>
    </article>
  );
};

export default BookAbout;
