import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';

const UserAvatarModal = ({
  avatar,
  isOpen,
  onClose,
  onSubmit,
  file,
  onChange,
  isProcessing,
  onDelete,
  validationErrors
}) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Avatar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group controlId="avatar">
          <Form.Label className="file-label">Avatar</Form.Label>
          <FileInput
            name="avatar"
            file={file}
            onChange={onChange}
            validationError={validationErrors.avatar}
          />
        </Form.Group>

        <div>
          <SubmitButton
            variant="outline-info"
            className="rounded-pill"
            isLoading={isProcessing}
            onClick={onSubmit}
          >
            Update
          </SubmitButton>

          {avatar !== '/storage/avatars/default.svg' && (
            <Button
              variant="outline-dark"
              className="rounded-pill ml-2"
              disabled={isProcessing}
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

UserAvatarModal.propTypes = {
  avatar: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  file: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default UserAvatarModal;
