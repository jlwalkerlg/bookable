import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlist';
import { addToCart, removeFromCart } from '../../actions/cart';
import { addRating, updateRating, deleteRating } from '../../actions/ratings';
import { addToShelf, removeFromShelf } from '../../actions/shelves';
import BookDisplayContainer from '../../components/BookDisplayContainer';
import BookReviewsContainer from '../../components/BookReviewsContainer';
import BookSimilarBooksContainer from '../../components/BookSimilarBooksContainer';

class Show extends Component {
  state = {
    isLoadingUserRating: true,
    errorUserRating: null,
    userRating: {},
    processing: {
      userRating: false
    },
    quantity: 1
  };

  componentDidMount() {
    const { user } = this.props;
    if (user.id) {
      this.fetchUserRating();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchUserRating();
    }
  }

  async fetchUserRating() {
    const { user } = this.props;
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/ratings', {
        params: { book_id: bookId, user_id: user.id }
      });
      const userRating = response.data.ratings[0];
      this.setState({ userRating, isLoadingUserRating: false });
    } catch (error) {
      console.log(error);
      this.setState({ errorUserRating: error, isLoadingUserRating: false });
    }
  }

  setProcessing(processing) {
    this.setState({ processing: { ...this.state.processing, ...processing } });
  }

  addRating = async (e, book) => {
    e.preventDefault();

    const { processing } = this.state;
    if (processing.userRating) return;

    this.setProcessing({ userRating: true });

    const rating = 5 - parseInt(e.target.dataset.index);
    const { user } = this.props;
    const userRating = await addRating(rating, book, user);
    this.setState({ userRating });

    this.setProcessing({ userRating: false });
  };

  updateRating = async (rating, newRating) => {
    await updateRating(rating, newRating);
    const userRating = { ...this.state.userRating, rating: newRating };
    this.setState({ userRating });
  };

  deleteRating = async rating => {
    await deleteRating(rating);
    this.setState({ userRating: null });
  };

  handleUpdateRating = async (e, rating) => {
    e.preventDefault();

    const { processing } = this.state;
    if (processing.userRating) return;

    this.setProcessing({ userRating: true });

    const newRating = 5 - parseInt(e.target.dataset.index);
    newRating === rating.rating
      ? await this.deleteRating(rating)
      : await this.updateRating(rating, newRating);

    this.setProcessing({ userRating: false });
  };

  render() {
    const bookId = this.props.match.params.id;
    const { user } = this.props;
    const { userRating } = this.state;

    return (
      <>
        <BookDisplayContainer bookId={bookId} />

        <BookSimilarBooksContainer bookId={bookId} />

        <BookReviewsContainer
          bookId={bookId}
          user={user}
          userRating={userRating}
        />
      </>
    );
  }
}

Show.propTypes = {
  user: PropTypes.object.isRequired,
  wishlist: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user, wishlist, cart }) => ({
  user,
  wishlist,
  cart
});

const mapDispatchToProps = {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
