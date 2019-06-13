import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

class ProductCard extends Component {
  state = {
    isInWishlist: null
  };

  componentDidMount() {
    const isInWishlist = this.inWishlist();
    this.setState({ isInWishlist });
  }

  inWishlist() {
    const { bookId, wishlist } = this.props;
    return !!wishlist.filter(book => book.id === bookId).length;
  }

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

    const { isInWishlist } = this.state;

    return (
      <div className={`product-card ${className || ''}`}>
        <img src={image} alt={title} className="product-card__img" />
        {wishlistButton && (
          <Form
            action="/"
            method="POST"
            // onSubmit={(toggleWishlist)}
            className="float-right"
          >
            <Button
              variant="link"
              type="submit"
              className="link-secondary p-0"
              aria-label={
                isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <i className="material-icons text-danger">
                {isInWishlist ? 'favorite' : 'favorite_border'}
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

const mapStateToProps = ({ user }) => ({
  wishlist: user.wishlist || []
});

export default connect(mapStateToProps)(ProductCard);
