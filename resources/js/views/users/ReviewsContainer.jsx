import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import withPagination from '../../components/withPagination';
import Loading from '../../components/Loading';
import Reviews from './Reviews';

class ReviewsContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    user: {},
    reviews: [],
    userReviews: [],
    count: 0
  };

  limit = 5;

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
      let { user, reviews, count } = await this.fetchReviews();

      const bookIds = reviews.map(review => review.book_id).join(',');

      const userReviews = this.props.user.id
        ? user.id !== this.props.user.id
          ? await this.fetchUserReviews(bookIds)
          : reviews
        : [];

      reviews = reviews.map(review => {
        const userReview = userReviews.filter(
          userReview => userReview.book_id === review.book_id
        )[0];

        return { ...review, userReview };
      });

      this.setState({ user, reviews, count, userReviews, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchReviews() {
    const { userId } = this.props.match.params;
    const offset = this.props.calcOffset(this.limit);

    const response = await axios.get(`/api/users/${userId}/reviews`, {
      cancelToken: this.source.token,
      params: { limit: this.limit, offset, count: true, with: 'book.author' }
    });

    return response.data;
  }

  async fetchUserReviews(bookIds) {
    const { user } = this.props;

    const response = await axios.get(`/api/reviews`, {
      cancelToken: this.source.token,
      params: { user_id: user.id, book_ids: bookIds }
    });

    return response.data.reviews;
  }

  render() {
    const { isLoading, error } = this.state;

    if (isLoading)
      return (
        <div className="vh-100">
          <Loading />
        </div>
      );

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <Reviews
        user={this.state.user}
        userId={this.props.match.params.userId}
        authUser={this.props.user}
        reviews={this.state.reviews}
        count={this.state.count}
        page={this.props.page}
        limit={this.limit}
        pathname={this.props.location.pathname}
      />
    );
  }
}

ReviewsContainer.propTypes = {
  user: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  calcOffset: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default withPagination(connect(mapStateToProps)(ReviewsContainer));
