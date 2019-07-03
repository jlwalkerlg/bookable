import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

const SubmitButton = ({ isLoading, variant, className, onClick, children }) => {
  const classes = 'rounded-pill';
  if (className) classes += ` ${className}`;

  return (
    <Button
      type="submit"
      variant={variant}
      className={classes}
      disabled={isLoading}
      onClick={onClick}
    >
      {children}
      {isLoading && (
        <Spinner
          className="align-text-bottom ml-2"
          size="sm"
          animation="border"
          role="status"
        />
      )}
    </Button>
  );
};

SubmitButton.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default SubmitButton;
