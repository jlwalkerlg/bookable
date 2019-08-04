import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

const Notification = ({ notification, onClose }) => {
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose(notification);
  };

  return (
    <Toast
      show={isOpen}
      onClose={handleClose}
      autohide={!!notification.autohide}
      delay={3000}
      className="notification"
    >
      <Toast.Header>
        <strong className="mr-5">Bookable</strong>
        <small className="ml-auto">Just now</small>
      </Toast.Header>
      <Toast.Body>{notification.message}</Toast.Body>
    </Toast>
  );
};

export default Notification;
