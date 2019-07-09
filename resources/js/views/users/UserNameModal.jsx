import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'react-bootstrap';
import SubmitButton from '../../components/SubmitButton';

const UserNameModal = ({
  name,
  isOpen,
  onClose,
  onSubmit,
  onChange,
  validationErrors,
  isProcessing
}) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Name</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form action="" method="POST" onSubmit={onSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>

            <Form.Control
              name="name"
              placeholder="Change user name..."
              value={name}
              onChange={onChange}
              isInvalid={!!validationErrors.name}
            />

            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <SubmitButton
            variant="outline-info"
            className="rounded-pill"
            isLoading={isProcessing}
          >
            Submit
          </SubmitButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

UserNameModal.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

export default UserNameModal;
