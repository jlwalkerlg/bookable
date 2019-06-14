import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { addToWishlist, removeFromWishlist } from '../actions/wishlist';

class ProductCard extends Component {
  inWishlist() {
    const { bookId, wishlist } = this.props;
    return !!wishlist.filter(book => book.id === bookId).length;
  }

  addToWishlist = e => {
    e.preventDefault();
    this.props.addToWishlist({ id: this.props.bookId });
  };

  removeFromWishlist = e => {
    e.preventDefault();
    this.props.removeFromWishlist(this.props.bookId);
  };

  render() {
    const {
      image,
      title,
      bookId,
      author,
      authorId,
      price,
      className,
      wishlistButton
    } = this.props;

    const inWishlist = this.inWishlist();

    return (
      <div className={`product-card ${className || ''}`}>
        <img src={image} alt={title} className="product-card__img" />
        {wishlistButton && (
          <Form
            action="/"
            method="POST"
            onSubmit={inWishlist ? this.removeFromWishlist : this.addToWishlist}
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
        <Link to={`/books/${bookId}`} className="product-card__title">
          {title}
        </Link>
        {author && (
          <p className="product-card__author">
            <span className="text-secondary">by: </span>
            <Link to={`/authors/${authorId}`}>{author}</Link>
          </p>
        )}
        <p className="product-card__price">£{price.toFixed(2)}</p>
      </div>
    );
  }
}

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
