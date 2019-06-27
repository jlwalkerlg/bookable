import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import sanitize from '../utils/sanitize';

const QuoteCard = ({
  quote,
  book,
  author,
  userQuote,
  authUser,
  onSave,
  onDelete
}) => {
  const handleSave = e => onSave(e, quote);
  const handleDelete = e => onDelete(e, userQuote);

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
            onSubmit={handleDelete}
          >
            <Button type="submit" variant="outline-info" size="sm">
              Unsave
            </Button>
          </Form>
        )}
        {authUser.id && !userQuote && (
          <Form action="/" method="POST" className="mt-2" onSubmit={handleSave}>
            <Button type="submit" variant="outline-info" size="sm">
              Save
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuoteCard;
