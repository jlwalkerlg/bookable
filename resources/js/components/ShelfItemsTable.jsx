import React, { Component } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Stars from './Stars';

class ShelfItemsTable extends Component {
  getRating(book) {
    return this.props.ratings.filter(rating => rating.book_id === book.id)[0];
  }

  getUserRating(book, rating) {
    if (this.props.user.id === this.props.authUser.id) return rating;

    return this.props.userRatings.filter(
      userRating => userRating.book_id === book.id
    )[0];
  }

  render() {
    const {
      user,
      authUser,
      shelfItems,
      className,
      onAddRating,
      onUpdateRating,
      onDeleteItem
    } = this.props;

    return (
      <Table responsive className={className}>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Average Rating</th>
            {user.id !== authUser.id && <th>User Rating</th>}
            {authUser.id && <th>Your Rating</th>}
            <th>Date Added</th>
            {user.id === authUser.id && <th />}
          </tr>
        </thead>
        <tbody>
          {shelfItems.map((shelfItem, index) => {
            const { book } = shelfItem;
            const { author } = book;
            const rating = this.getRating(book);
            const userRating = this.getUserRating(book, rating);

            return (
              <tr key={index}>
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
                {user.id !== authUser.id && (
                  <td className="text-nowrap">
                    <Stars rating={(rating && rating.rating) || 0} />
                  </td>
                )}
                {authUser.id && (
                  <td className="text-nowrap">
                    <Stars
                      rating={(userRating && userRating.rating) || 0}
                      // editable
                      // onClick={
                      //   userRating
                      //     ? e => onUpdateRating(e, userRating)
                      //     : e => onAddRating(e, book)
                      // }
                    />
                  </td>
                )}
                <td>{shelfItem.created_at}</td>
                <td>
                  {user.id === authUser.id && (
                    <Form
                      action="/"
                      method="POST"
                      onSubmit={e => onDeleteItem(e, shelfItem)}
                    >
                      <Button
                        variant="link"
                        type="submit"
                        className="text-body p-0"
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
  }
}

export default ShelfItemsTable;
