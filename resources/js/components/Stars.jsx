import React from 'react';
import PropTypes from 'prop-types';

const Stars = ({ rating, editable, className, onClick }) => {
  return (
    <span className={`stars ${className || ''}`}>
      {new Array(5).fill(0).map((item, index) => (
        <span
          key={index}
          data-index={index}
          onClick={editable ? onClick : undefined}
          className={`star${editable ? ' editable' : ''}${
            5 - index === rating ? ' active' : ''
          }`}
        >
          {editable && (
            <input type="radio" value={index + 1} className="sr-only" />
          )}
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
