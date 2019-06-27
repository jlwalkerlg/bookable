import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import URL from '../utils/URL';
import Async from '../components/Async';
import ReviewListing from '../components/ReviewListing';

class Reviews extends Component {
  state = {
    loading: {
      user: true,
      reviews: true,
      userReviews: true
    },
    errors: {
      user: null,
      reviews: null,
      userReviews: null
    },
    user: null,
    reviews: null,
    userReviews: null,
    count: null,
    limit: 5
  };

  componentDidMount() {
    this.fetchReviews();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchReviews();
    }
  }

  fetchReviews = async () => {
    this.setLoading({ user: true, reviews: true });
    const { limit } = this.state;
    const { userId } = this.props.match.params;
    const offset = this.calcOffset();
    try {
      const response = await axios.get(`/api/users/${userId}/reviews`, {
        params: { limit, offset, count: true, with: 'book.author' }
      });
      const { user, reviews, count } = response.data;
      this.setState({ user, reviews, count });
      this.setError({
        user: null,
        reviews: null
      });

      this.fetchUserReviews(reviews);
    } catch (error) {
      this.setError({
        user: error.response.statusText,
        reviews: error.response.statusText
      });
    }
    this.setLoading({ user: false, reviews: false });
  };

  fetchUserReviews = async reviews => {
    this.setLoading({ userReviews: true });

    const userId = parseInt(this.props.match.params.userId);
    const authUser = this.props.user;
    if (!authUser.id) {
      this.setError({ userReviews: null });
      this.setLoading({ userReviews: false });
      return;
    }
    if (userId === authUser.id) {
      this.setState({ userReviews: reviews });
      this.setError({ userReviews: null });
      this.setLoading({ userReviews: false });
      return;
    }

    const bookIds = (reviews || this.state.reviews).map(
      review => review.book_id
    );
    try {
      const response = await axios.get(`/api/reviews`, {
        params: { user_id: authUser.id, book_ids: bookIds.join(',') }
      });
      const userReviews = response.data.reviews;
      this.setState({ userReviews });
      this.setError({ userReviews: null });
    } catch (error) {
      this.setError({ userReviews: error.response.statusText });
    }
    this.setLoading({ userReviews: false });
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

  setUserReviews(userReviews) {
    if (this.state.user.id === this.props.user.id)
      return this.setState({ reviews: userReviews, userReviews });
    return this.setState({ userReviews });
  }

  getUserReview(review) {
    const { userReviews } = this.state;
    if (!userReviews) return null;

    if (review.user_id === this.props.user.id) return review;

    return userReviews.filter(
      userReview => userReview.book_id === review.book_id
    )[0];
  }

  render() {
    const { loading, errors, user, reviews, count, limit } = this.state;
    const authUser = this.props.user;

    return (
      <div className="section">
        <Container>
          <Async
            loading={loading.user}
            error={errors.user}
            retry={this.fetchReviews}
          >
            {() => (
              <>
                <h1 className="h5 text-uppercase mb-0">
                  {user.name}&apos;s Reviews
                </h1>
                <Async
                  loading={loading.reviews}
                  error={errors.reviews}
                  retry={this.fetchReviews}
                >
                  {() => (
                    <>
                      {reviews.map((item, index) => {
                        const { book } = item;
                        const { author } = book;
                        const review = authUser.id === user.id ? null : item;
                        const userReview =
                          authUser.id === user.id
                            ? item
                            : this.getUserReview(item);

                        return (
                          <ReviewListing
                            key={index}
                            book={book}
                            author={author}
                            review={review}
                            userReview={userReview}
                            createdAt={item.created_at}
                            className="mt-3 py-2 border-bottom"
                          />
                        );
                      })}
                      <Pagination
                        totalItems={count}
                        currentPage={this.getCurrentPage()}
                        pageSize={limit}
                        url={`/users/${user.id}/reviews?page=`}
                        className="justify-content-center pagination-warning mt-4"
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

export default connect(mapStateToProps)(Reviews);
