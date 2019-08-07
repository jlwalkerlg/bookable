import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Media from 'react-responsive';
import Loading from '../../components/Loading';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import WishlistProductRow from '../../components/WishlistProductRow';
import WishlistProductListing from '../../components/WishlistProductListing';

const Wishlist = ({
  items,
  isLoading,
  error,
  onRemoveItem,
  isProcessingWishlist,
  isProcessingCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  if (!items.length)
    return (
      <p>
        There are no items in your wishlist!{' '}
        <Link to="/books" className="default">
          Get shopping!
        </Link>
      </p>
    );

  return (
    <Media minWidth={768}>
      {matches =>
        matches ? (
          <div className="product-table">
            <Row className="product-table__head">
              <Col md={6}>
                <p>Product Name</p>
              </Col>
              <Col md={3}>
                <p>Price</p>
              </Col>
              <Col md={3} aria-hidden="true" />
            </Row>

            {items.map(item => {
              return (
                <WishlistProductRow
                  key={item.id}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  isProcessingWishlist={isProcessingWishlist}
                  isProcessingCart={isProcessingCart}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                />
              );
            })}
          </div>
        ) : (
          <div>
            {items.map(item => {
              return (
                <WishlistProductListing
                  key={item.id}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  isProcessingWishlist={isProcessingWishlist}
                  isProcessingCart={isProcessingCart}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                />
              );
            })}
          </div>
        )
      }
    </Media>
  );
};

Wishlist.propTypes = {
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onRemoveItem: PropTypes.func.isRequired,
  isProcessingWishlist: PropTypes.bool.isRequired,
  isProcessingCart: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
};

export default Wishlist;
