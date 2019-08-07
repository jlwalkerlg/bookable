import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Media from 'react-responsive';

const PlainStars = ({ rating, className, onClick }) => {
  return (
    <span className={`stars pointer ${className || ''}`} onClick={onClick}>
      {new Array(5).fill(0).map((item, index) => (
        <span
          key={index}
          className={`star${5 - index === rating ? ' active' : ''}`}
        >
          &#9734;
        </span>
      ))}
    </span>
  );
};

const StarsModal = ({ isOpen, onClose, onClick, className, ...props }) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <ListGroup>
        {[1, 2, 3, 4, 5].map(value => {
          return (
            <ListGroup.Item
              key={value}
              action
              onClick={onClick}
              data-value={value}
              {...props}
            >
              <span className={`stars ${className || ''}`}>
                {new Array(value).fill(0).map((item, index) => (
                  <span key={index} className="star active">
                    &#9734;
                  </span>
                ))}
              </span>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Modal>
  );
};

const StarsMobile = ({
  rating = 0,
  editable,
  onClick,
  className,
  ...props
}) => {
  const [isOpen, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleRating = e => {
    onClick(e);
    setOpen(false);
  };

  return (
    <>
      <PlainStars
        onClick={editable ? handleOpenModal : undefined}
        rating={rating}
        editable={editable}
      />

      {editable && (
        <StarsModal
          rating={rating}
          onClick={handleRating}
          isOpen={isOpen}
          onClose={handleCloseModal}
          className={className}
          {...props}
        />
      )}
    </>
  );
};

const StarsDesktop = ({
  rating = 0,
  editable,
  className,
  onClick,
  ...props
}) => {
  return (
    <span className={`stars ${className || ''}`}>
      {new Array(5).fill(0).map((item, index) => {
        const value = 5 - index;

        return (
          <span
            key={value}
            data-value={value}
            {...props}
            onClick={editable ? onClick : undefined}
            className={`star${editable ? ' editable' : ''}${
              value === rating ? ' active' : ''
            }`}
          >
            {editable && (
              <input type="radio" value={value} className="sr-only" />
            )}
            &#9734;
          </span>
        );
      })}
    </span>
  );
};

const Stars = ({ rating = 0, editable, className, onClick, ...props }) => {
  return (
    <Media minWidth={786}>
      {matches =>
        matches ? (
          <StarsDesktop
            rating={rating}
            editable={editable}
            onClick={onClick}
            className={className}
            {...props}
          />
        ) : (
          <StarsMobile
            rating={rating}
            editable={editable}
            onClick={onClick}
            className={className}
            {...props}
          />
        )
      }
    </Media>
  );
};

Stars.propTypes = {
  rating: PropTypes.number,
  editable: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Stars;
