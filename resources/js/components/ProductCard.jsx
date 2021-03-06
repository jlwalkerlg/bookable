import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addToWishlist, removeFromWishlist } from '../actions/wishlist';
import { addNotification } from '../actions/notifications';

class ProductCard extends Component {
  state = {
    isProcessing: false,
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
      this.props.addNotification(`Something went wrong: ${error.message}.`);
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
      this.props.addNotification(`Something went wrong: ${error.message}.`);
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

        <p className="product-card__rating">
          Average Rating: {book.avg_rating.toFixed(2)}
        </p>

        <p className="product-card__date">Published: {book.publication_date}</p>

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
  size: PropTypes.string,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, wishlist }) => ({
  user,
  wishlist,
});

const mapDispatchToProps = {
  addToWishlist,
  removeFromWishlist,
  addNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductCard);
