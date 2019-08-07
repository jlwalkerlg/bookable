import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';

const CategoryHeader = ({ category }) => {
  return (
    <header className="section category-head">
      <Container>
        <h1 className="category-head__title">{category.name}</h1>
      </Container>
    </header>
  );
};

CategoryHeader.propTypes = {
  category: PropTypes.object.isRequired
};

export default CategoryHeader;
