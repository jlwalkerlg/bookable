import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FeaturedBook from './FeaturedBook';

const HomeTrendingCategory = ({ category, book }) => {
  return (
    <article className="bg-beige section text-center">
      <FeaturedBook
        title={() => (
          <>
            <span>Trending in</span>{' '}
            <Link to={`/categories/${category.id}`}>{category.name}</Link>
          </>
        )}
        book={book}
        author={book.author}
        variant="left"
      />
    </article>
  );
};

HomeTrendingCategory.propTypes = {
  category: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired
};

export default HomeTrendingCategory;
