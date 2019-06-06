import React from 'react';

const ProductCard = ({ image, title, author, price, ...props }) => {
  return (
    <div {...props}>
      <img src={image} alt={title} className="d-block mx-auto mb-3" />
      <p className="font-weight-bold text-body font-serif mb-0">{title}</p>
      <p className="text-secondary mb-1">by: {author}</p>
      <p className="text-warning h5">£{price}</p>
    </div>
  );
};

export default ProductCard;
