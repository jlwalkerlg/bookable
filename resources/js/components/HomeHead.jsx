import React from 'react';
import { Link } from 'react-router-dom';

const HomeHead = () => {
  return (
    <header className="site-head">
      <div className="text-center">
        <h1 className="site-head__title">Welcome to Bookable</h1>
        <p className="mb-4 site-head__subtitle">Fall in love with books.</p>
        <Link
          to="/books"
          className="btn btn-outline-light btn-lg rounded-pill site-head__cta"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
};

export default HomeHead;
