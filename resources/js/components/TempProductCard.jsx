import React from 'react';
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

export default TempProductCard;
