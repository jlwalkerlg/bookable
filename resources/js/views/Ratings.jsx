import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import URL from '../utils/URL';
import BookListing from '../components/BookListing';
import RatingsTable from '../components/RatingsTable';
import { addRating, updateRating, deleteRating } from '../actions/ratings';
import Async from '../components/Async';

class Ratings extends Component {
  state = {
    loading: {
      user: true,
      ratings: true,
      userRatings: true
    },
    errors: {
      user: null,
      ratings: null,
      userRatings: null
    },
    user: null,
    ratings: null,
    userRatings: null,
    count: null,
    limit: 10
  };

  componentDidMount() {
    this.fetchRatings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchRatings();
    }
  }

  fetchRatings = async () => {
    this.setLoading({ user: true, ratings: true });
    const { limit } = this.state;
    const { userId } = this.props.match.params;
    const offset = this.calcOffset();
    try {
      const response = await axios.get(`/api/users/${userId}/ratings`, {
        params: { limit, offset, count: true, with: 'book.author' }
      });
      const { user, ratings, count } = response.data;
      this.setState({ user, ratings, count });
      this.setError({
        user: null,
        ratings: null
      });

      this.fetchUserRatings(ratings);
    } catch (error) {
      this.setError({
        user: error.response.statusText,
        ratings: error.response.statusText
      });
    }
    this.setLoading({ user: false, ratings: false });
  };

  fetchUserRatings = async ratings => {
    this.setLoading({ userRatings: true });

    const userId = parseInt(this.props.match.params.userId);
    const authUser = this.props.user;
    if (!authUser.id) {
      this.setError({ userRatings: null });
      this.setLoading({ userRatings: false });
      return;
    }
    if (userId === authUser.id) {
      this.setState({ userRatings: ratings });
      this.setError({ userRatings: null });
      this.setLoading({ userRatings: false });
      return;
    }

    const bookIds = (ratings || this.state.ratings).map(
      rating => rating.book_id
    );
    try {
      const response = await axios.get(`/api/ratingss`, {
        params: { user_id: authUser.id, book_ids: bookIds.join(',') }
      });
      const userRatings = response.data.ratings;
      this.setState({ userRatings });
      this.setError({ userRatings: null });
    } catch (error) {
      this.setError({ userRatings: error.response.statusText });
    }
    this.setLoading({ userRatings: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
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

  addRating = async (e, book) => {
    e.preventDefault();
    const rating = 5 - parseInt(e.target.dataset.index);
    const { user } = this.props;
    const newRating = await addRating(rating, book, user);
    const userRatings = [...this.state.userRatings, newRating];
    this.setUserRatings(userRatings);
  };

  updateRating = async (rating, newRating) => {
    await updateRating(rating, newRating);
    const userRatings = this.state.userRatings.map(userRating =>
      userRating.id === rating.id
        ? { ...userRating, rating: newRating }
        : userRating
    );
    this.setUserRatings(userRatings);
  };

  deleteRating = async (e, rating) => {
    e.preventDefault();
    await deleteRating(rating);
    const userRatings = this.state.userRatings.filter(
      userRating => userRating.id !== rating.id
    );
    this.setUserRatings(userRatings);
  };

  handleUpdateRating = (e, rating) => {
    e.preventDefault();
    const newRating = 5 - parseInt(e.target.dataset.index);
    if (newRating !== rating.rating) this.updateRating(rating, newRating);
  };

  setUserRatings(userRatings) {
    if (this.state.user.id === this.props.user.id)
      return this.setState({ ratings: userRatings, userRatings });
    return this.setState({ userRatings });
  }

  getUserRating(rating) {
    const { userRatings } = this.state;
    if (!userRatings) return null;

    if (rating.user_id === this.props.user.id) return rating;

    return userRatings.filter(
      userRating => userRating.book_id === rating.book_id
    )[0];
  }

  render() {
    const { loading, errors, user, ratings, count, limit } = this.state;

    return (
      <div className="section">
        <Container>
          <Async
            loading={loading.user}
            error={errors.user}
            retry={this.fetchRatings}
          >
            {() => (
              <>
                <h1 className="h5 text-uppercase mb-0">
                  {user.name}&apos;s Ratings
                </h1>

                <Async
                  loading={loading.ratings || loading.userRatings}
                  error={errors.ratings || errors.userRatings}
                  retry={
                    errors.ratings
                      ? this.fetchRatings
                      : () => this.fetchUserRatings()
                  }
                >
                  {() => (
                    <>
                      <RatingsTable
                        className="d-none d-md-table mt-3"
                        user={user}
                        ratings={ratings}
                        authUser={this.props.user}
                        userRatings={this.state.userRatings}
                        onAddRating={this.addRating}
                        onUpdateRating={this.handleUpdateRating}
                        onDeleteRating={this.deleteRating}
                      />

                      <div className="d-md-none mt-3">
                        {ratings.map((rating, index) => {
                          const { book } = rating;
                          const userRating = this.getUserRating(rating);

                          return (
                            <BookListing
                              key={index}
                              user={user}
                              authUser={this.props.user}
                              book={book}
                              author={book.author}
                              rating={rating}
                              userRating={userRating}
                              createdAt={rating.created_at}
                              onAddRating={this.addRating}
                              onUpdateRating={this.handleUpdateRating}
                              deletable={user.id === this.props.user.id}
                              onDelete={e => this.deleteRating(e, userRating)}
                            />
                          );
                        })}
                      </div>
                      <Pagination
                        totalItems={count}
                        currentPage={this.getCurrentPage()}
                        pageSize={limit}
                        maxPages={5}
                        url={`${this.props.location.pathname}?page=`}
                        className="mt-3 justify-content-center pagination-warning"
                      />
                    </>
                  )}
                </Async>
              </>
            )}
          </Async>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Ratings);
