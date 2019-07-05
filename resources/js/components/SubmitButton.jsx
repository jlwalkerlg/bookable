import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

const SubmitButton = ({
  isLoading,
  variant = 'primary',
  className,
  onClick,
  children
}) => {
  return (
    <Button
      type="submit"
      variant={variant}
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
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default SubmitButton;
