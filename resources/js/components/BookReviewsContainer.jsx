import React, { Component } from 'react';
import axios from 'axios';
import BookReviews from './BookReviews';
import { Container } from 'react-bootstrap';
import BookUserReview from './BookUserReview';

class BookReviewsContainer extends Component {
  state = {
    isLoadingReviews: true,
    errorReviews: null,
    reviews: [],
    isLoadingUserReview: true,
    errorUserReview: null,
    userReview: {}
  };

  componentDidMount() {
    const { user } = this.props;

    this.fetchReviews();

    if (user.id) {
      this.fetchUserReview();
    } else {
      this.setState({ isLoadingUserReview: false });
    }
  }

  async fetchReviews() {
    const { bookId } = this.props;
    try {
      const response = await axios.get('/api/reviews', {
        params: { book_id: bookId, with: 'user' }
      });
      let { reviews } = response.data;

      const ratings = await this.fetchRatings(reviews);

      reviews = reviews
        .filter(review => review.user_id !== this.props.user.id)
        .map(review => ({
          ...review,
          rating: ratings.filter(rating => rating.user_id === review.user_id)[0]
        }));

      this.setState({ reviews, isLoadingReviews: false });
    } catch (error) {
      this.setState({ errorReviews: error, isLoadingReviews: false });
    }
  }

  async fetchRatings(reviews) {
    const userIds = reviews.map(review => review.user_id).join(',');
    const { bookId } = this.props;
    const response = await axios.get('/api/ratings', {
      params: { book_id: bookId, user_ids: userIds }
    });
    return response.data.ratings;
  }

  async fetchUserReview() {
    const { user, bookId } = this.props;
    try {
      const response = await axios.get('/api/reviews', {
        params: { book_id: bookId, user_id: user.id }
      });
      const userReview = response.data.reviews[0];
      this.setState({
        userReview: { ...userReview, rating: this.props.userRating },
        isLoadingUserReview: false
      });
    } catch (error) {
      this.setState({ errorUserReview: error, isLoadingUserReview: false });
    }
  }

  render() {
    const { user, bookId } = this.props;
    const {
      isLoadingReviews,
      errorReviews,
      isLoadingUserReview,
      errorUserReview,
      reviews,
      userReview
    } = this.state;

    return (
      <article id="reviews" className="section">
        <Container>
          <h3 className="text-uppercase mb-3 h6">Reviews</h3>
          {user.id && (
            <BookUserReview
              bookId={bookId}
              isLoading={isLoadingUserReview}
              error={errorUserReview}
              review={userReview}
              user={user}
            />
          )}
          <div className="mt-3">
            <BookReviews
              isLoading={isLoadingReviews}
              error={errorReviews}
              reviews={reviews}
            />
          </div>
        </Container>
      </article>
    );
  }
}

export default BookReviewsContainer;
