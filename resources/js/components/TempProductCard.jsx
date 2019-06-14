import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const TempProductCard = ({ title, author, image, price, ...props }) => {
  const book = {
    id: 1,
    title,
    author: { id: 1, name: author },
    author_id: 1,
    image_url: image,
    price
  };

  return <ProductCard book={book} {...props} />;
};

TempProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};

export default TempProductCard;
