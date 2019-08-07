import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const SubmitButton = ({
  isLoading,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  children,
}) => {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
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
  variant: PropTypes.string,
  size: PropTypes.string,
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default SubmitButton;
