import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, title, author, price, className, ...props }) => {
  return (
    <div {...props} className={`product-card ${className || ''}`}>
      <img src={image} alt={title} className="product-card__img" />
      <Link to="/books/1" className="product-card__title">
        {title}
      </Link>
      {author && (
        <p className="product-card__author">
          <span className="text-secondary">by: </span>
          <Link to="/books/1">{author}</Link>
        </p>
      )}
      <p className="product-card__price">£{price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
