import React from 'react';
import FeaturedBook from './FeaturedBook';

const HomeBestSeller = ({ book }) => {
  return (
    <article className="bg-beige section text-center">
      <FeaturedBook
        title="Best Seller"
        book={book}
        author={book.author}
        variant="middle"
      />
    </article>
  );
};

export default HomeBestSeller;
