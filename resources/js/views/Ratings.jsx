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
    user: null,
    ratings: null,
    authUserRatings: null,
    count: null,
    limit: 10
  };

  async componentDidMount() {
    this.fetchRatings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState({ loading: true });
      this.fetchRatings();
    }
  }

  async fetchRatings() {
    const { user, ratings, count } = await this.fetchUserRatings();

    const isLoggedIn = !!this.props.user.id;
    const areOwnRatings = this.props.user.id === user.id;

    const userRatings = !areOwnRatings ? ratings : null;
    const authUserRatings =
      isLoggedIn &&
      (areOwnRatings
        ? ratings
        : await this.fetchAuthUserRatings(
            ratings.map(rating => rating.book_id)
          ));

    this.setState({
      user,
      ratings: userRatings,
      count,
      authUserRatings,
      loading: false
    });
  }

  async fetchUserRatings() {
    const { limit } = this.state;
    const { userId } = this.props.match.params;
    const offset = this.calcOffset();
    try {
      const response = await axios.get(`/api/users/${userId}/ratings`, {
        params: { limit, offset, count: true, with: 'book.author' }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAuthUserRatings(bookIds) {
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
      const response = await axios.post(`/api/users/${user.id}/ratings`, {
        rating,
        book_id: book.id
      });
      const authUserRatings = [...this.state.authUserRatings, response.data];
      this.setState({ authUserRatings });
    } catch (error) {
      console.log(error);
    }
  }

  handleExistingRating = (e, rating) => {
    e.preventDefault();
    const newRating = 5 - parseInt(e.target.dataset.index);
    if (newRating !== rating.rating) this.updateRating(rating, newRating);
  };

  async updateRating(rating, newRating) {
    try {
      await axios.patch(`/api/ratings/${rating.id}`, {
        rating: newRating
      });
      const authUserRatings = this.state.authUserRatings.map(authRating =>
        authRating.id === rating.id
          ? { ...rating, rating: newRating }
          : authRating
      );
      this.setState({ authUserRatings });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRating(e, rating) {
    e.preventDefault();
    try {
      await axios.delete(`/api/ratings/${rating.id}`);
      const authUserRatings = this.state.authUserRatings.filter(
        authRating => authRating.id !== rating.id
      );
      this.setState({ authUserRatings });
    } catch (error) {
      console.log(error);
    }
  }

  getAuthUserRating(rating) {
    const authUser = this.props.user;
    const { authUserRatings, ratings } = this.state;

    if (!authUser.id) return null;
    if (authUser.id && !ratings) return rating;
    return authUserRatings.filter(
      authRating => authRating.book_id == rating.book_id
    )[0];
  }

  render() {
    const {
      loading,
      user,
      ratings,
      count,
      authUserRatings,
      limit
    } = this.state;
    const authUser = this.props.user;

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
            {user.name}&apos;s Ratings
          </h1>
          <Table responsive className="d-none d-md-table mb-3">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Average Rating</th>
                {ratings && <th>User Rating</th>}
                {authUser.id && <th>Your Rating</th>}
                <th>Date Added</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(ratings || authUserRatings).map((rating, index) => {
                const { book } = rating;
                const { author } = book;
                const authUserRating = this.getAuthUserRating(rating);
                const authRating = authUserRating ? authUserRating.rating : 0;

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
                    {ratings && (
                      <td className="text-nowrap">
                        <Stars rating={rating.rating} />
                      </td>
                    )}
                    {authUser.id && (
                      <td className="text-nowrap">
                        <Stars
                          rating={authRating}
                          editable
                          onClick={
                            authUserRating
                              ? e =>
                                  this.handleExistingRating(e, authUserRating)
                              : e => this.addRating(e, book)
                          }
                        />
                      </td>
                    )}
                    <td>{rating.created_at}</td>
                    <td>
                      {authUserRating && (
                        <Form
                          action="/"
                          method="POST"
                          onSubmit={e => this.deleteRating(e, authUserRating)}
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

          <div className="d-md-none mb-3">
            {(ratings || authUserRatings).map((rating, index) => {
              const { book } = rating;
              const { author } = book;
              const authUserRating = this.getAuthUserRating(rating);
              const authRating = authUserRating ? authUserRating.rating : 0;

              return (
                <Media key={index} className="product-table__row py-3">
                  <img src={book.image_url} alt={book.title} className="mr-3" />
                  <Media.Body>
                    {authUserRating && (
                      <Form
                        action="/"
                        method="POST"
                        className="float-right"
                        onSubmit={e => this.deleteRating(e, authUserRating)}
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
                    {ratings && (
                      <p className="font-size-7 mb-2">
                        <span className="text-secondary">User Rating:</span>{' '}
                        <Stars rating={rating.rating} />
                      </p>
                    )}
                    {authUser.id && (
                      <p className="mb-2 font-size-5">
                        <span className="text-secondary font-size-7">
                          Your rating:
                        </span>{' '}
                        <Stars
                          rating={authRating}
                          editable
                          onClick={
                            authUserRating
                              ? e =>
                                  this.handleExistingRating(e, authUserRating)
                              : e => this.addRating(e, book)
                          }
                        />
                      </p>
                    )}
                    <p className="font-size-7 mb-2">
                      <span className="text-secondary">Date Added:</span>{' '}
                      {rating.created_at}
                    </p>
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
