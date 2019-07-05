import React from 'react';
import PropTypes from 'prop-types';
import { Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Stars from './Stars';

const ShelfItemsTable = ({
  user,
  userId,
  items,
  onAddRating,
  onUpdateRating,
  isProcessingRating,
  onDeleteItem,
  isProcessingItem
}) => {
  const userIdInt = parseInt(userId);

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Author</th>
          <th>Average Rating</th>
          {user.id !== userIdInt && <th>User Rating</th>}
          {user.id && <th>Your Rating</th>}
          <th>Date Added</th>
          {user.id === userIdInt && <th />}
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          const { book } = item;
          const { author } = book;

          return (
            <tr key={item.id}>
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
                  <Stars rating={item.rating || 0} />
                </td>
              )}
              {user.id && (
                <td className="text-nowrap">
                  <Stars
                    rating={item.userRating || 0}
                    editable
                    data-rating={item.userRating}
                    data-book-id={item.book.id}
                    onClick={item.userRating ? onUpdateRating : onAddRating}
                    className={isProcessingRating && 'disabled'}
                  />
                </td>
              )}
              <td>{item.created_at}</td>
              {user.id === userIdInt && (
                <td>
                  <Form
                    action="/"
                    method="POST"
                    data-book-id={book.id}
                    onSubmit={onDeleteItem}
                  >
                    <Button
                      variant="link"
                      type="submit"
                      className="text-body p-0"
                      disabled={isProcessingItem}
                    >
                      <i className="material-icons">clear</i>
                    </Button>
                  </Form>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

ShelfItemsTable.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onAddRating: PropTypes.func,
  onUpdateRating: PropTypes.func.isRequired,
  isProcessingRating: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  isProcessingItem: PropTypes.bool.isRequired
};

export default ShelfItemsTable;
