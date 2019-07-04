import React from 'react';
import PropTypes from 'prop-types';
import Stars from './Stars';

const BookUserRating = ({
  isProcessing,
  userRating,
  onAddRating,
  onUpdateRating
}) => {
  return (
    <div className="text-center mt-3">
      <p>
        Your rating:
        <Stars
          className={`ml-2${isProcessing ? ' disabled' : ''}`}
          editable={!isProcessing}
          onClick={userRating.id ? onUpdateRating : onAddRating}
          rating={userRating.rating || 0}
        />
      </p>
    </div>
  );
};

BookUserRating.propTypes = {
  isProcessing: PropTypes.bool.isRequired,
  userRating: PropTypes.object.isRequired,
  onAddRating: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired
};

export default BookUserRating;
