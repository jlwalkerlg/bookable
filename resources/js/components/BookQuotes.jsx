import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import sanitize from '../utils/sanitize';

const BookQuotes = ({ book, quotes, isLoading, error }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <section id="quotes" className="mb-4">
      <h3 className="text-uppercase font-size-6">Quotes</h3>
      <ul className="list-unstyled mb-3">
        {quotes.map((quote, index) => (
          <li
            key={index}
            className="quote mb-3"
            dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
          />
        ))}
      </ul>
      <p className="font-weight-bold">
        <Link to={`/books/${book.id}/quotes`}>More Quotes...</Link>
      </p>
    </section>
  );
};

export default BookQuotes;
