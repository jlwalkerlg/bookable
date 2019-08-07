import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Stars from './Stars';

const RatingsTable = ({
  user,
  userId,
  ratings,
  onAddRating,
  onUpdateRating,
  onDeleteRating,
  isProcessingRating,
}) => {
  const userIdInt = parseInt(userId);

  return (
    <Table responsive className="d-none d-md-table mt-3">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Author</th>
          <th>Average Rating</th>
          {user.id !== userIdInt && <th>User Rating</th>}
          {user.id && <th>Your Rating</th>}
          <th>Date Added</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {ratings.map(rating => {
          const { book } = rating;
          const { author } = book;

          return (
            <tr key={rating.id}>
              <td>
                <img src={book.small_image_url} alt={book.title} />
              </td>
              <td>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </td>
              <td>
                <Link to={`/authors/${author.id}`}>{author.name}</Link>
              </td>
              <td>{book.avg_rating.toFixed(2)}</td>
              {user.id !== userIdInt && (
                <td className="text-nowrap">
                  <Stars rating={rating.rating} />
                </td>
              )}
              {user.id && (
                <td className="text-nowrap">
                  <Stars
                    className={isProcessingRating ? 'disabled' : null}
                    rating={rating.userRating || 0}
                    editable
                    data-book-id={book.id}
                    data-rating={rating.userRating}
                    onClick={rating.userRating ? onUpdateRating : onAddRating}
                  />
                </td>
              )}
              <td>{rating.created_at}</td>
              <td>
                {rating.userRating && (
                  <Form
                    action="/"
                    method="POST"
                    data-book-id={book.id}
                    onSubmit={onDeleteRating}
                  >
                    <Button
                      variant="link"
                      type="submit"
                      className="text-body p-0"
                      disabled={isProcessingRating}
                    >
                      <i className="material-icons">clear</i>
                    </Button>
                  </Form>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

RatingsTable.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  ratings: PropTypes.array.isRequired,
  onAddRating: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired,
  onDeleteRating: PropTypes.func.isRequired,
  isProcessingRating: PropTypes.bool.isRequired,
};

export default RatingsTable;
