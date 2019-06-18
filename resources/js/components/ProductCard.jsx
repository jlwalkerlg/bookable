import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { addToWishlist, removeFromWishlist } from '../actions/wishlist';

class ProductCard extends Component {
  inWishlist() {
    const { wishlist } = this.props;
    const { items } = wishlist;
    const bookId = this.props.book.id;
    return items && !!items.filter(item => item.book_id === bookId).length;
  }

  addToWishlist = (e, book) => {
    e.preventDefault();
    this.props.addToWishlist(book);
  };

  removeFromWishlist = (e, bookId) => {
    e.preventDefault();
    this.props.removeFromWishlist(bookId);
  };

  render() {
    const { book, className, wishlistButton, size } = this.props;
    const { author } = book;

    const inWishlist = this.inWishlist();

    return (
      <div className={`product-card ${className || ''}`}>
        <img
          src={book[(size ? `${size}_` : '') + 'image_url']}
          alt={book.title}
          className="product-card__img"
        />
        {wishlistButton && (
          <Form
            action="/"
            method="POST"
            onSubmit={
              inWishlist
                ? e => this.removeFromWishlist(e, book.id)
                : e => this.addToWishlist(e, book)
            }
            className="float-right"
          >
            <Button
              variant="link"
              type="submit"
              className="link-secondary p-0"
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
  wishlist: PropTypes.object.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  className: PropTypes.string,
  wishlistButton: PropTypes.bool,
  size: PropTypes.string
};

const mapStateToProps = ({ wishlist }) => ({
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
