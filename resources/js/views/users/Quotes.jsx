import React from 'react';
import { Container } from 'react-bootstrap';
import QuoteCard from '../../components/QuoteCard';
import Pagination from '../../components/Pagination';

const Quotes = ({
  quotes,
  user,
  authUser,
  count,
  limit,
  page,
  pathname,
  onSave,
  onDelete,
  isProcessing
}) => {
  return (
    <div className="section">
      <Container>
        <h1 className="h5 text-uppercase mb-0 mb-md-3">
          {user.name}&apos;s Quotes
        </h1>

        <div className="col-count-2">
          {quotes.map(quote => {
            const { userQuote, book, author } = quote;

            return (
              <QuoteCard
                key={quote.id}
                quote={quote}
                book={book}
                author={author}
                userQuote={userQuote}
                authUser={authUser}
                onSave={onSave}
                onDelete={onDelete}
                isProcessing={isProcessing}
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

export default Quotes;
