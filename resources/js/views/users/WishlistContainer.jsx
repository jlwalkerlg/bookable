import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { removeFromWishlist } from '../../actions/wishlist';
import { addToCart, removeFromCart } from '../../actions/cart';
import Wishlist from './Wishlist';
import { Container } from 'react-bootstrap';

class WishlistContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    items: [],
    isProcessingWishlist: false,
    isProcessingCart: false
  };

  source = axios.CancelToken.source();

  async componentDidMount() {
    const { wishlist, cart } = this.props;

    try {
      const response = await axios.get(`/api/wishlists/${wishlist.id}/items`, {
        cancelToken: this.source.token,
        params: { with: 'book.author' }
      });

      let { items } = response.data;

      items = items.map(wishlistItem => ({
        ...wishlistItem,
        isInCart: !!cart.items.filter(
          cartItem => cartItem.book_id === wishlistItem.book_id
        )[0]
      }));

      this.setState({ items, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  handleRemoveItem = async e => {
    e.preventDefault();

    if (this.state.isProcessingWishlist) return;

    this.setState({ isProcessingWishlist: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.removeFromWishlist(bookId);

      const items = this.state.items.filter(item => item.book_id !== bookId);

      this.setState({ items, isProcessingWishlist: false });
    } catch (error) {
      this.setState({ error, isProcessingWishlist: false });
    }
  };

  handleAddToCart = async e => {
    e.preventDefault();

    if (this.state.isProcessingCart) return;

    this.setState({ isProcessingCart: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.addToCart(bookId);

      const items = this.state.items.map(item =>
        item.book_id !== bookId ? item : { ...item, isInCart: true }
      );

      this.setState({ items, isProcessingCart: false });
    } catch (error) {
      this.setState({ error, isProcessingCart: false });
    }
  };

  handleRemoveFromCart = async e => {
    e.preventDefault();

    if (this.state.isProcessingCart) return;

    this.setState({ isProcessingCart: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.removeFromCart(bookId);

      const items = this.state.items.map(item =>
        item.book_id !== bookId ? item : { ...item, isInCart: false }
      );

      this.setState({ items, isProcessingCart: false });
    } catch (error) {
      this.setState({ error, isProcessingCart: false });
    }
  };

  render() {
    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Wishlist</h1>
          <Wishlist
            items={this.state.items}
            isLoading={this.state.isLoading}
            error={this.state.error}
            onRemoveItem={this.handleRemoveItem}
            isProcessingWishlist={this.state.isProcessingWishlist}
            onAddToCart={this.handleAddToCart}
            onRemoveFromCart={this.handleRemoveFromCart}
            isProcessingCart={this.state.isProcessingCart}
          />
        </Container>
      </main>
    );
  }
}

WishlistContainer.propTypes = {
  wishlist: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const mapStateToProps = ({ wishlist, cart }) => ({
  wishlist,
  cart
});

const mapDispatchToProps = {
  removeFromWishlist,
  addToCart,
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WishlistContainer);
