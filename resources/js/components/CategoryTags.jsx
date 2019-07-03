import React from 'react';
import PropTypes from 'prop-types';

const CategoryTags = ({ categories, onChange }) => {
  return (
    <>
      {categories.map((category, index) => (
        <div key={index} className="mr-2">
          <input
            type="checkbox"
            className="sr-only"
            id={`category_${category.name}`}
            onChange={onChange}
            data-category-id={category.id}
          />
          <label
            htmlFor={`category_${category.name}`}
            className={
              'tag btn btn-sm rounded-pill ' +
              (category.checked ? 'btn-info' : 'btn-outline-info')
            }
          >
            {category.name}
          </label>
        </div>
      ))}
    </>
  );
};

CategoryTags.propTypes = {
  categories: PropTypes.array.isRequired,
  onChange: PropTypes.func
};

export default CategoryTags;
