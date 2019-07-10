import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import withPagination from '../../components/withPagination';
import Loading from '../../components/Loading';
import Ratings from './Ratings';
import { addRating, updateRating, deleteRating } from '../../actions/ratings';
import { Container } from 'react-bootstrap';

class RatingsContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    isProcessingRating: false,
    user: {},
    ratings: [],
    userRatings: [],
    count: 0
  };

  limit = 10;

  source = axios.CancelToken.source();

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoading: true }, this.fetchData);
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchData() {
    try {
      let { user, ratings, count } = await this.fetchRatings();

      const bookIds = ratings.map(rating => rating.book_id).join(',');

      const userRatings = this.props.user.id
        ? user.id !== this.props.user.id
          ? await this.fetchUserRatings(bookIds)
          : ratings
        : [];

      ratings = ratings.map(rating => {
        const userRating = userRatings.filter(
          userRating => userRating.book_id === rating.book_id
        )[0];

        return { ...rating, userRating: userRating && userRating.rating };
      });

      this.setState({ user, ratings, count, userRatings, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchRatings() {
    const { userId } = this.props.match.params;
    const offset = this.props.calcOffset(this.limit);

    const response = await axios.get(`/api/users/${userId}/ratings`, {
      cancelToken: this.source.token,
      params: { limit: this.limit, offset, count: true, with: 'book.author' }
    });

    return response.data;
  }

  async fetchUserRatings(bookIds) {
    const { user } = this.props;

    const response = await axios.get(`/api/ratings`, {
      cancelToken: this.source.token,
      params: { user_id: user.id, book_ids: bookIds }
    });

    return response.data.ratings;
  }

  handleAddRating = async e => {
    e.preventDefault();

    if (this.state.isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const rating = 5 - parseInt(e.target.dataset.index);
    const bookId = parseInt(e.target.dataset.bookId);
    const { user } = this.props;

    try {
      const newRating = await addRating(rating, bookId, user.id);

      const ratings = this.state.ratings.map(rating =>
        rating.book_id !== bookId
          ? rating
          : { ...rating, userRating: newRating.rating }
      );

      const userRatings = [...this.state.userRatings, newRating];

      this.setState({ ratings, userRatings, isProcessingRating: false });
    } catch (error) {
      this.setState({ error, isProcessingRating: false });
    }
  };

  handleUpdateRating = async e => {
    e.preventDefault();

    if (this.state.isProcessingRating) return;

    const currentRating = parseInt(e.target.dataset.rating);
    const newRating = 5 - parseInt(e.target.dataset.index);

    if (currentRating === newRating) return;

    this.setState({ isProcessingRating: true });

    const bookId = parseInt(e.target.dataset.bookId);

    const rating = this.state.userRatings.filter(
      userRating => userRating.book_id === bookId
    )[0];

    try {
      const updatedRating = await updateRating(rating.id, newRating);

      const ratings = this.state.ratings.map(rating =>
        rating.book_id !== updatedRating.book_id
          ? rating
          : { ...rating, userRating: updatedRating.rating }
      );

      const userRatings = this.state.userRatings.map(userRating =>
        userRating.id !== updatedRating ? userRating : updatedRating
      );

      this.setState({ ratings, userRatings, isProcessingRating: false });
    } catch (error) {
      this.setState({ error, isProcessingRating: false });
    }
  };

  handleDeleteRating = async e => {
    e.preventDefault();

    if (this.state.isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const bookId = parseInt(e.target.dataset.bookId);

    const userRating = this.state.userRatings.filter(
      userRating => userRating.book_id === bookId
    )[0];

    try {
      await deleteRating(userRating.id);

      const ratings = this.state.ratings.map(rating =>
        rating.book_id !== userRating.book_id
          ? rating
          : { ...rating, userRating: null }
      );

      const userRatings = this.state.userRatings.filter(
        rating => rating.id !== userRating.id
      );

      this.setState({ ratings, userRatings, isProcessingRating: false });
    } catch (error) {
      this.setState({ error, isProcessingRating: false });
    }
  };

  render() {
    const { isLoading, error, user } = this.state;

    if (isLoading)
      return (
        <div className="vh-100">
          <Loading />
        </div>
      );

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <div className="section">
        <Container>
          <h1 className="h5 text-uppercase mb-0">{user.name}&apos;s Ratings</h1>
          <Ratings
            userId={this.props.match.params.userId}
            user={this.state.user}
            authUser={this.props.user}
            ratings={this.state.ratings}
            count={this.state.count}
            limit={this.limit}
            page={this.props.page}
            pathname={this.props.location.pathname}
            onAddRating={this.handleAddRating}
            onUpdateRating={this.handleUpdateRating}
            onDeleteRating={this.handleDeleteRating}
            isProcessingRating={this.state.isProcessingRating}
          />
        </Container>
      </div>
    );
  }
}

RatingsContainer.propTypes = {
  user: PropTypes.object.isRequired,
  calcOffset: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  page: PropTypes.number.isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default withPagination(connect(mapStateToProps)(RatingsContainer));
