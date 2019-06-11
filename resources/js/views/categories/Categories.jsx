import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <main className="section bg-beige">
      <Container>
        <h1 className="h5 text-uppercase mb-4">Categories</h1>
        <ul className="list-unstyled categories-list">
          {new Array(6).fill(0).map((item, index) => (
            <li key={index} className="categories-list__category">
              <Link to="/category/1">
                <p>Philosophy</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
};

export default Categories;
