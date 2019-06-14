import React from 'react';
import PropTypes from 'prop-types';

const Stars = ({ rating, editable, ...props }) => {
  return (
    <span className="stars">
      {new Array(5).fill(0).map((item, index) => (
        <span
          key={index}
          data-index={index}
          {...props}
          className={`star${editable ? ' editable' : ''}${
            5 - index === rating ? ' active' : ''
          }`}
        >
          &#9734;
        </span>
      ))}
    </span>
  );
};

Stars.propTypes = {
  rating: PropTypes.number.isRequired,
  editable: PropTypes.bool
};

export default Stars;
