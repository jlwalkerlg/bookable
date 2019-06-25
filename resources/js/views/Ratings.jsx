import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import URL from '../utils/URL';
import Loading from '../components/Loading';
import BookListing from '../components/BookListing';
import RatingsTable from '../components/RatingsTable';
import { addRating, updateRating, deleteRating } from '../actions/ratings';

class Ratings extends Component {
  state = {
    loading: true,
    user: null,
    ratings: null,
    userRatings: null,
    count: null,
    limit: 10
  };

  async componentDidMount() {
    await this.fetchData();
    this.setState({ loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState({ loading: true });
      await this.fetchData();
      this.setState({ loading: false });
    }
  }

  async fetchData() {
    const { user, ratings, count } = await this.fetchRatings();

    if (!this.props.user.id) {
      return this.setState({ user, ratings, count });
    }

    if (user.id === this.props.user.id) {
      return this.setState({ user, ratings, userRatings: ratings, count });
    }

    const bookIds = ratings.map(rating => rating.book_id);
    const userRatings = (await this.fetchUserRatings(bookIds)).ratings;

    return this.setState({ user, ratings, userRatings, count });
  }

  async fetchRatings() {
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

  async fetchUserRatings(bookIds) {
    const { user } = this.props;
    try {
      const response = await axios.get(`/api/ratings`, {
        params: { user_id: user.id, book_ids: bookIds.join(',') }
      });
      return response.data;
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
    const { loading, user, ratings, count, limit } = this.state;

    if (loading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    return (
      <div className="section">
        <Container>
          <h1 className="h5 text-uppercase mb-0">{user.name}&apos;s Ratings</h1>

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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Ratings);
