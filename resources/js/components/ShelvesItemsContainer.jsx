import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import withPagination from './withPagination';
import ShelvesItems from './ShelvesItems';
import Loading from './Loading';
import { addRating, updateRating, deleteRating } from '../actions/ratings';
import { removeFromShelf } from '../actions/shelves';

class ShelvesItemsContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    shelfItems: [],
    ratings: [],
    userRatings: [],
    count: 0,
    isProcessingRating: false,
    isProcessingItem: false
  };

  limit = 20;

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
    const { userId, shelfId, user } = this.props;
    const userIdInt = parseInt(userId);
    const offset = this.props.calcOffset(this.limit);

    try {
      const response = await axios.get('/api/shelves/items', {
        cancelToken: this.source.token,
        params: {
          limit: this.limit,
          offset,
          with: 'book.author',
          count: true,
          shelf_id: shelfId,
          user_id: userId
        }
      });

      const { items, count } = response.data;

      const bookIds = items.map(item => item.book_id).join(',');

      const [ratings, userRatings] = await axios.all([
        user.id !== userIdInt ? this.fetchRatings(bookIds) : [],
        user.id && user.id !== userIdInt
          ? this.fetchUserRatings(bookIds)
          : this.fetchRatings(bookIds)
      ]);

      const shelfItems = items.map(item => {
        const rating = ratings.filter(
          rating => rating.book_id === item.book_id
        )[0];

        const userRating = userRatings.filter(
          rating => rating.book_id === item.book_id
        )[0];

        return {
          ...item,
          rating: rating && rating.rating,
          userRating: userRating && userRating.rating
        };
      });

      this.setState({
        shelfItems,
        ratings,
        userRatings,
        count,
        isLoading: false
      });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchRatings(book_ids) {
    const { userId } = this.props;
    const response = await axios.get('/api/ratings', {
      cancelToken: this.source.token,
      params: { user_id: userId, book_ids }
    });
    return response.data.ratings;
  }

  async fetchUserRatings(book_ids) {
    const { user } = this.props;
    const response = await axios.get('/api/ratings', {
      cancelToken: this.source.token,
      params: { user_id: user.id, book_ids }
    });
    return response.data.ratings;
  }

  handleAddRating = async e => {
    if (this.state.isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const rating = 5 - parseInt(e.target.dataset.index);

    const bookId = parseInt(e.target.dataset.bookId);
    const userId = this.props.user.id;

    try {
      const newRating = await addRating(rating, bookId, userId);

      const userRatings = [...this.state.userRatings, newRating];

      const shelfItems = this.state.shelfItems.map(item =>
        item.book_id !== bookId
          ? item
          : { ...item, userRating: newRating.rating }
      );

      this.setState({ userRatings, shelfItems, isProcessingRating: false });
    } catch (error) {
      console.log(error);
    }
  };

  handleUpdateRating = async e => {
    if (this.state.isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const currentRating = parseInt(e.target.dataset.rating);
    const newRating = 5 - parseInt(e.target.dataset.index);

    const bookId = parseInt(e.target.dataset.bookId);

    const rating = this.state.userRatings.filter(
      rating => rating.book_id === bookId
    )[0];

    try {
      const [userRatings, shelfItems] =
        currentRating === newRating
          ? await this.deleteRating(rating)
          : await this.updateRating(rating, newRating);
      this.setState({ userRatings, shelfItems, isProcessingRating: false });
    } catch (error) {
      console.log(error);
    }
  };

  async updateRating(rating, newRating) {
    const updatedRating = await updateRating(rating.id, newRating);

    const userRatings = this.state.userRatings.map(userRating =>
      userRating.id !== updatedRating.id ? userRating : updatedRating
    );

    const shelfItems = this.state.shelfItems.map(item =>
      item.book_id !== updatedRating.book_id
        ? item
        : { ...item, userRating: updatedRating.rating }
    );

    return [userRatings, shelfItems];
  }

  async deleteRating(rating) {
    await deleteRating(rating.id);

    const userRatings = this.state.userRatings.filter(
      userRating => userRating.id !== rating.id
    );

    const shelfItems = this.state.shelfItems.map(item =>
      item.book_id !== rating.book_id ? item : { ...item, userRating: null }
    );

    return [userRatings, shelfItems];
  }

  handleDeleteItem = async e => {
    e.preventDefault();

    if (this.state.isProcessingItem) return;

    this.setState({ isProcessingItem: true });

    const bookId = parseInt(e.target.dataset.bookId);

    const item = this.state.shelfItems.filter(
      item => item.book_id === bookId
    )[0];

    try {
      await removeFromShelf(item.id);

      const shelfItems = this.state.shelfItems.filter(
        item => item.book_id !== bookId
      );

      this.setState({ shelfItems, isProcessingItem: false });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { isLoading, error } = this.state;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <ShelvesItems
        user={this.props.user}
        userId={this.props.userId}
        items={this.state.shelfItems}
        limit={this.limit}
        count={this.state.count}
        page={this.props.page}
        pathname={this.props.location.pathname}
        onAddRating={this.handleAddRating}
        onUpdateRating={this.handleUpdateRating}
        isProcessingRating={this.state.isProcessingRating}
        onDeleteItem={this.handleDeleteItem}
        isProcessingItem={this.state.isProcessingItem}
      />
    );
  }
}

ShelvesItemsContainer.propTypes = {
  user: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  shelfId: PropTypes.string,
  page: PropTypes.number.isRequired,
  calcOffset: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default withRouter(
  withPagination(connect(mapStateToProps)(ShelvesItemsContainer))
);
