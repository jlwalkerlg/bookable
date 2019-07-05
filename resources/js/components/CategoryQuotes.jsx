import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import sanitize from '../utils/sanitize';
import Loading from './Loading';

const CategoryQuotes = ({ quotes, category, isLoading, error }) => {
  return (
    <>
      <h2 className="h5 text-uppercase">Quotes in {category.name}</h2>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p>Something went wrong: {error.message}.</p>
      ) : (
        <>
          <ul className="list-unstyled">
            {quotes.map(quote => (
              <li
                key={quote.id}
                className="quote mb-3"
                dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
              />
            ))}
          </ul>
          <Link
            to={`/categories/${category.id}/quotes`}
            className="font-weight-bold"
          >
            Read More
          </Link>
        </>
      )}
    </>
  );
};

CategoryQuotes.propTypes = {
  quotes: PropTypes.array.isRequired,
  category: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object
};

export default CategoryQuotes;
