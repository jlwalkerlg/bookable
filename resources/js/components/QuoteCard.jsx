import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import sanitize from '../utils/sanitize';
import SubmitButton from './SubmitButton';

const QuoteCard = ({
  quote,
  book,
  author,
  userQuote,
  authUser,
  onSave,
  onDelete,
  isProcessing,
}) => {
  return (
    <Card className="d-inline-block w-100 mt-3">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p
            className="font-size-6"
            dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
          />
          <footer className="blockquote-footer">
            <Link to={`/authors/${author.id}`}>{author.name}</Link> in{' '}
            <cite title="Source Title">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </cite>
          </footer>
        </blockquote>

        {userQuote && (
          <Form
            action="/"
            method="POST"
            className="mt-2"
            data-quote-id={quote.id}
            onSubmit={onDelete}
          >
            <SubmitButton variant="info" size="sm" isLoading={isProcessing}>
              Unsave
            </SubmitButton>
          </Form>
        )}

        {authUser.id && !userQuote && (
          <Form
            action="/"
            method="POST"
            className="mt-2"
            data-quote-id={quote.id}
            onSubmit={onSave}
          >
            <SubmitButton
              variant="outline-info"
              size="sm"
              isLoading={isProcessing}
            >
              Save
            </SubmitButton>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

QuoteCard.propTypes = {
  quote: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  userQuote: PropTypes.object,
  authUser: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

export default QuoteCard;
