import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { addToWishlist, removeFromWishlist } from '../actions/wishlist';

class ProductCard extends Component {
  state = {
    isProcessing: false
  };

  inWishlist() {
    const { wishlist } = this.props;
    const { items } = wishlist;
    const bookId = this.props.book.id;
    return items && !!items.filter(item => item.book_id === bookId).length;
  }

  addToWishlist = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;
    this.setState({ isProcessing: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.addToWishlist(bookId);
    } catch (error) {
      console.log(error);
    }
    this.setState({ isProcessing: false });
  };

  removeFromWishlist = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;
    this.setState({ isProcessing: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.removeFromWishlist(bookId);
    } catch (error) {
      console.log(error);
    }
    this.setState({ isProcessing: false });
  };

  render() {
    const { isProcessing } = this.state;
    const { book, className, wishlistButton, size, user } = this.props;
    const { author } = book;

    const inWishlist = this.inWishlist();
    const image =
      book[(size ? `${size}_` : '') + 'image_url'] || book.image_url;

    return (
      <div className={`product-card ${className || ''}`}>
        <img src={image} alt={book.title} className="product-card__img" />
        {user.id && wishlistButton && (
          <Form
            action="/"
            method="POST"
            data-book-id={book.id}
            onSubmit={inWishlist ? this.removeFromWishlist : this.addToWishlist}
            className="float-right"
          >
            <Button
              variant="link"
              type="submit"
              className="link-secondary p-0"
              disabled={isProcessing}
              aria-label={
                inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <i className="material-icons text-danger">
                {inWishlist ? 'favorite' : 'favorite_border'}
              </i>
            </Button>
          </Form>
        )}
        <Link to={`/books/${book.id}`} className="product-card__title">
          {book.title}
        </Link>
        {author && (
          <p className="product-card__author">
            <span className="text-secondary">by: </span>
            <Link to={`/authors/${author.id}`}>{author.name}</Link>
          </p>
        )}
        <p className="product-card__price">£{book.price.toFixed(2)}</p>
      </div>
    );
  }
}

ProductCard.propTypes = {
  user: PropTypes.object.isRequired,
  wishlist: PropTypes.object.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  className: PropTypes.string,
  wishlistButton: PropTypes.bool,
  size: PropTypes.string
};

const mapStateToProps = ({ user, wishlist }) => ({
  user,
  wishlist
});

const mapDispatchToProps = {
  addToWishlist,
  removeFromWishlist
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductCard);
