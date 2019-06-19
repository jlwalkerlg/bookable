import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, Form, Button, Media } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import URL from '../utils/URL';
import Loading from '../components/Loading';
import Stars from '../components/Stars';

class Ratings extends Component {
  state = {
    loading: true,
    rater: null,
    ratings: null,
    count: null,
    userRatings: null,
    limit: 10
  };

  async componentDidMount() {
    const { user, ratings, count } = await this.fetchRatings();
    const authUser = this.props.user;
    const userRatings =
      authUser.id === user.id
        ? ratings
        : await this.fetchUserRatings(ratings.map(rating => rating.book_id));
    this.setState({ rater: user, ratings, count, userRatings, loading: false });
  }

  async fetchRatings() {
    const { limit } = this.state;
    const { userId } = this.props.match.params;
    const offset = this.calcOffset();
    try {
      const response = await axios.get(`/api/users/${userId}/ratings`, {
        params: { limit, offset, with: 'book.author' }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserRatings(bookIds) {
    const { user } = this.props;
    try {
      const response = await axios.get(`/api/ratings`, {
        params: { user_id: user.id, book_ids: bookIds.join(',') }
      });
      return response.data.ratings;
    } catch (error) {
      console.log(error);
    }
  }

  calcOffset() {
    const { limit } = this.state;
    const page = this.getCurrentPage();
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return (
      parseInt(URL.query(this.props.location.search).getParam('page')) || 1
    );
  }

  async addRating(e, book) {
    e.preventDefault();
    const rating = 5 - parseInt(e.target.dataset.index);
    const { user } = this.props;
    try {
      const newRating = await axios.post(`/api/users/${user.id}/ratings`, {
        rating,
        book_id: book.id
      });
      const userRatings = [...this.state.userRatings, newRating.data];
      this.setState({ userRatings });
    } catch (error) {
      console.log(error);
    }
  }

  handleExistingRating = (e, rating) => {
    e.preventDefault();
    const newRating = 5 - parseInt(e.target.dataset.index);
    newRating === rating.rating
      ? this.deleteRating(rating)
      : this.updateRating(rating, newRating);
  };

  async updateRating(rating, newRating) {
    try {
      const response = await axios.patch(`/api/ratings/${rating.id}`, {
        rating: newRating
      });
      const updatedRating = response.data;
      const userRatings = this.state.userRatings.map(rating =>
        rating.id === updatedRating.id ? updatedRating : rating
      );
      this.setState({ userRatings });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRating(rating) {
    try {
      axios.delete(`/api/ratings/${rating.id}`);
      const userRatings = this.state.userRatings.filter(
        userRating => userRating.id !== rating.id
      );
      this.setState({ userRatings });
    } catch (error) {
      console.log(error);
    }
  }

  getUserRating(book) {
    const { userRatings } = this.state;
    return userRatings.filter(rating => rating.book_id === book.id)[0];
  }

  render() {
    const { loading, rater, ratings, count, limit } = this.state;
    const { user } = this.props;

    if (loading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    return (
      <div className="section">
        <Container>
          <h1 className="h5 text-uppercase mb-0 mb-md-3">
            {rater.name}&apos;s Ratings
          </h1>
          <Table responsive className="d-none d-md-table mb-3">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Average Rating</th>
                {rater.id !== user.id && <th>User Rating</th>}
                {user.id && <th>Your Rating</th>}
                <th>Date Added</th>
                {null && <th />}
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating, index) => {
                const book = rating.book;
                const author = book.author;
                const userRating = this.getUserRating(book);

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
                    {rater.id !== user.id && (
                      <td className="text-nowrap">
                        <Stars rating={rating.rating} />
                      </td>
                    )}
                    {user.id && (
                      <td className="text-nowrap">
                        <Stars
                          rating={(userRating && userRating.rating) || 0}
                          editable
                          onClick={
                            userRating
                              ? e => this.handleExistingRating(e, userRating)
                              : e => this.addRating(e, book)
                          }
                        />
                      </td>
                    )}
                    <td>{rating.created_at}</td>
                    {null && (
                      <td>
                        <Form
                          action="/"
                          method="POST"
                          onSubmit={e => this.removeFromShelf(e, rating)}
                        >
                          <Button
                            variant="link"
                            type="submit"
                            className="text-danger p-0"
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

          <div className="d-md-none mb-3">
            {ratings.map((rating, index) => {
              const book = rating.book;
              const author = book.author;
              const userRating = this.getUserRating(book);

              return (
                <Media key={index} className="product-table__row py-3">
                  <img src={book.image_url} alt={book.title} className="mr-3" />
                  <Media.Body>
                    <p className="h5">
                      <Link to={`/books/${book.id}`}>{book.title}</Link>
                    </p>
                    <p>
                      <span className="text-secondary">by: </span>
                      <Link to={`/authors/${author.id}`}>{author.name}</Link>
                    </p>
                    <p className="font-size-7 mb-2">
                      <span className="text-secondary">Average rating:</span>{' '}
                      {book.avg_rating.toFixed(2)}
                    </p>
                    {rater.id !== user.id && (
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">User Rating:</span>{' '}
                        <Stars rating={rating.rating} />
                      </p>
                    )}
                    {user.id && (
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">Your rating:</span>{' '}
                        <Stars
                          rating={(userRating && userRating.rating) || 0}
                          editable
                          onClick={
                            userRating
                              ? e => this.handleExistingRating(e, userRating)
                              : e => this.addRating(e, book)
                          }
                        />
                      </p>
                    )}
                    <p className="font-size-7 mb-2">
                      <span className="text-secondary">Date Added:</span>{' '}
                      {rating.created_at}
                    </p>
                    {null && (
                      <Form
                        action="/"
                        method="POST"
                        onSubmit={e => this.removeFromShelf(e, rating)}
                      >
                        <Button
                          variant="link"
                          type="submit"
                          className="text-danger p-0 font-size-7"
                        >
                          Remove from shelf
                        </Button>
                      </Form>
                    )}
                  </Media.Body>
                </Media>
              );
            })}
          </div>
          <Pagination
            totalItems={count}
            currentPage={this.getCurrentPage()}
            pageSize={limit}
            maxPages={5}
            url={`${this.props.location.pathname}?page=`}
            className="justify-content-center pagination-warning"
          />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Ratings);
