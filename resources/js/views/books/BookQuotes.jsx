import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import QuoteCardContainer from '../../components/QuoteCardContainer';

const BookQuotes = ({
  book,
  quotes,
  user,
  count,
  page,
  pathname,
  limit,
  onSave,
  onDelete
}) => {
  return (
    <div className="section">
      <Container>
        <h1 className="h5 text-uppercase mb-0 mb-md-3">
          Quotes in <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h1>

        <div className="col-count-2">
          {quotes.map(quote => {
            return (
              <QuoteCardContainer
                key={quote.id}
                quote={quote}
                book={book}
                author={quote.author}
                userQuote={quote.userQuote}
                user={user}
                onSave={onSave}
                onDelete={onDelete}
              />
            );
          })}
        </div>

        <Pagination
          totalItems={count}
          currentPage={page}
          pageSize={limit}
          maxPages={5}
          url={`${pathname}?page=`}
          className="justify-content-center pagination-warning mt-4"
        />
      </Container>
    </div>
  );
};

BookQuotes.propTypes = {
  book: PropTypes.object.isRequired,
  quotes: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BookQuotes;
