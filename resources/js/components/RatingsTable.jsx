import React, { Component } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Stars from './Stars';

class RatingsTable extends Component {
  getRating(book) {
    return this.props.ratings.filter(rating => rating.book_id === book.id)[0];
  }

  getUserRating(rating) {
    const { userRatings } = this.props;
    if (!userRatings) return null;

    if (rating.user_id === this.props.authUser.id) return rating;

    return userRatings.filter(
      userRating => userRating.book_id === rating.book_id
    )[0];
  }

  render() {
    const {
      user,
      ratings,
      authUser,
      className,
      onAddRating,
      onUpdateRating,
      onDeleteRating
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
            <th />
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => {
            const { book } = rating;
            const { author } = book;
            const userRating = this.getUserRating(rating);

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
                    <Stars rating={rating.rating} />
                  </td>
                )}
                {authUser.id && (
                  <td className="text-nowrap">
                    <Stars
                      rating={(userRating && userRating.rating) || 0}
                      editable
                      onClick={
                        userRating
                          ? e => onUpdateRating(e, userRating)
                          : e => onAddRating(e, book)
                      }
                    />
                  </td>
                )}
                <td>{rating.created_at}</td>
                <td>
                  {userRating && (
                    <Form
                      action="/"
                      method="POST"
                      onSubmit={e => onDeleteRating(e, userRating)}
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

export default RatingsTable;
