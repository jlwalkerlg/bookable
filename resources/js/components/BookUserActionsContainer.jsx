import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BookWishlistForm from './BookWishlistForm';
import { addToWishlist, removeFromWishlist } from '../actions/wishlist';
import { addToCart, removeFromCart } from '../actions/cart';
import BookCartForm from './BookCartForm';
import BookShelvesFormContainer from './BookShelvesFormContainer';

class BookUserActionsContainer extends Component {
  state = {
    cartQuantity: 1
  };

  isInWishlist() {
    const { wishlist, book } = this.props;
    return !!wishlist.items.filter(item => item.book_id === book.id)[0];
  }

  handleAddToWishlist = e => {
    e.preventDefault();
    this.props.addToWishlist(this.props.book.id);
  };

  handleRemoveFromWishlist = e => {
    e.preventDefault();
    this.props.removeFromWishlist(this.props.book.id);
  };

  isInCart() {
    const { cart, book } = this.props;
    return !!cart.items.filter(item => item.book_id === book.id)[0];
  }

  handleChangeCartQuantity = e => {
    this.setState({ cartQuantity: parseInt(e.target.value) });
  };

  handleAddToCart = e => {
    e.preventDefault();
    this.props.addToCart(this.props.book.id, this.state.cartQuantity);
  };

  handleRemoveFromCart = e => {
    e.preventDefault();
    this.props.removeFromCart(this.props.book.id);
  };

  render() {
    const {
      book,
      user,
      shelves,
      isLoadingShelves,
      errorShelves,
      addToShelf,
      removeFromShelf
    } = this.props;
    const { cartQuantity } = this.state;

    return (
      <>
        <BookCartForm
          quantity={cartQuantity}
          onChange={this.handleChangeCartQuantity}
          isInCart={this.isInCart()}
          addToCart={this.handleAddToCart}
          removeFromCart={this.handleRemoveFromCart}
        />

        <BookWishlistForm
          book={book}
          isInWishlist={this.isInWishlist()}
          removeFromWishlist={this.handleRemoveFromWishlist}
          addToWishlist={this.handleAddToWishlist}
        />

        <div>
          <BookShelvesFormContainer
            book={book}
            user={user}
            shelves={shelves}
            isLoading={isLoadingShelves}
            error={errorShelves}
            addToShelf={addToShelf}
            removeFromShelf={removeFromShelf}
          />
        </div>
      </>
    );
  }
}

BookUserActionsContainer.propTypes = {
  user: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  wishlist: PropTypes.object.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const mapStateToProps = ({ user, cart, wishlist }) => ({
  user,
  cart,
  wishlist
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
)(BookUserActionsContainer);
