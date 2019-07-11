import React from 'react';
import { Container } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import QuoteCardContainer from '../../components/QuoteCardContainer';

const Quotes = ({
  quotes,
  user,
  authUser,
  count,
  limit,
  page,
  pathname,
  onSave,
  onDelete
}) => {
  return (
    <div className="section">
      <Container>
        <h1 className="h5 text-uppercase mb-0 mb-md-3">
          {user.name}&apos;s Quotes
        </h1>

        {!count && <p>{user.name} has not saved any quotes.</p>}

        {count && (
          <>
            <div className="col-count-2">
              {quotes.map(quote => {
                return (
                  <QuoteCardContainer
                    key={quote.id}
                    quote={quote}
                    book={quote.book}
                    author={quote.author}
                    userQuote={quote.userQuote}
                    user={authUser}
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
          </>
        )}
      </Container>
    </div>
  );
};

export default Quotes;
