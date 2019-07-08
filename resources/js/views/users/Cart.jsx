import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Loading from '../../components/Loading';
import MediaResponsive from 'react-responsive';
import ProductRow from '../../components/ProductRow';
import ProductListing from '../../components/ProductListing';
import CartCheckoutCard from '../../components/CartCheckoutCard';

const Cart = ({
  items,
  isLoading,
  error,
  isProcessingDelete,
  onDeleteItem
}) => {
  if (isLoading)
    return (
      <div className="vh-100">
        <Loading />
      </div>
    );

  if (error) return <p>Something went wrong: {error.message}.</p>;

  if (!items.length)
    return (
      <p>
        There are no items in your cart!{' '}
        <Link to="/books" className="default">
          Get shopping!
        </Link>
      </p>
    );

  return (
    <>
      <MediaResponsive minWidth={760}>
        {matches =>
          matches ? (
            <div className="product-table mb-4">
              <Row className="product-table__head">
                <Col md={3}>
                  <p>Product Name</p>
                </Col>
                <Col md={3}>
                  <p>Price</p>
                </Col>
                <Col md={3}>
                  <p>Quantity</p>
                </Col>
                <Col md={3} aria-hidden="true" />
              </Row>

              {items.map(item => {
                return (
                  <ProductRow
                    key={item.id}
                    item={item}
                    isProcessingDelete={isProcessingDelete}
                    onDelete={onDeleteItem}
                  />
                );
              })}
            </div>
          ) : (
            <div>
              {items.map(item => {
                return (
                  <ProductListing
                    key={item.id}
                    item={item}
                    isProcessingDelete={isProcessingDelete}
                    onDelete={onDeleteItem}
                  />
                );
              })}
            </div>
          )
        }
      </MediaResponsive>

      <CartCheckoutCard items={items} />
    </>
  );
};

Cart.propTypes = {
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  isProcessingDelete: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};

export default Cart;
