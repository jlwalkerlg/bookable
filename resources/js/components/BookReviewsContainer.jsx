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
