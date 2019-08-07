import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Editor } from 'react-draft-wysiwyg/dist/react-draft-wysiwyg';
import SubmitButton from './SubmitButton';

const ReviewForm = ({
  book,
  user,
  onSubmit,
  editorState,
  onChange,
  isProcessing,
  validationErrors
}) => {
  return (
    <>
      <h1 className="h4">
        Review: <Link to={`/books/${book.id}`}>{book.title}</Link>
      </h1>
      <p>
        &mdash; <Link to={`/users/${user.id}`}>{user.name}</Link>
      </p>

      <Form onSubmit={onSubmit}>
        <Form.Group controlId="review">
          <Form.Label srOnly>Your review</Form.Label>

          <Editor
            editorState={editorState}
            wrapperClassName=""
            toolbarClassName="mb-0"
            editorClassName="border border-top-0 px-3"
            onEditorStateChange={onChange}
            isInvalid={!!validationErrors.review}
          />

          {validationErrors.review && (
            <div className="invalid-feedback d-block">
              {validationErrors.review}
            </div>
          )}
        </Form.Group>

        <SubmitButton
          variant="warning"
          className="rounded-pill d-inline-block"
          isLoading={isProcessing}
        >
          Submit Review
        </SubmitButton>
      </Form>
    </>
  );
};

ReviewForm.propTypes = {
  book: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default ReviewForm;
