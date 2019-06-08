import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, title, author, price, className, ...props }) => {
  return (
    <div {...props} className={`product-card ${className || ''}`}>
      <img src={image} alt={title} className="product-card__img" />
      <Link to="/books/show" className="product-card__title">
        {title}
      </Link>
      {author && (
        <p className="text-secondary">
          by:{' '}
          <Link to="/books/show" className="product-card__author">
            {author}
          </Link>
        </p>
      )}
      <p className="product-card__price">£{price}</p>
    </div>
  );
};

export default ProductCard;
