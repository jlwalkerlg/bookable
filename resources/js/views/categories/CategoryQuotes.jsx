import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Pagination from '../../components/Pagination';
import QuoteCardContainer from '../../components/QuoteCardContainer';

const CategoryQuotes = ({
  category,
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
          Quotes in{' '}
          <Link to={`/categories/${category.id}`}>{category.name}</Link>
        </h1>

        <div className="col-count-2">
          {quotes.map(quote => {
            return (
              <QuoteCardContainer
                key={quote.id}
                quote={quote}
                book={quote.book}
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

CategoryQuotes.propTypes = {
  category: PropTypes.object.isRequired,
  quotes: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CategoryQuotes;
