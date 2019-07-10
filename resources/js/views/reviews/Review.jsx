import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg/dist/react-draft-wysiwyg';
import sanitize from '../../utils/sanitize';
import SubmitButton from '../../components/SubmitButton';
import { Container, Form, Button } from 'react-bootstrap';

const Review = ({
  review,
  onSubmit,
  isEditing,
  editorState,
  onChange,
  isProcessing,
  authUser,
  onBeginEdit,
  onCancelEdit,
  onDelete,
  validationErrors
}) => {
  const { book, user } = review;

  return (
    <main className="section">
      <Container>
        <h1 className="h4">
          Review: <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h1>
        <p>
          &mdash; <Link to={`/users/${user.id}`}>{user.name}</Link>
        </p>

        {isEditing && (
          <div className="d-flex justify-content-between">
            <Form onSubmit={onSubmit}>
              <Editor
                editorState={editorState}
                wrapperClassName=""
                toolbarClassName="mb-0"
                editorClassName="border border-top-0 px-3"
                onEditorStateChange={onChange}
              />

              {validationErrors.review && (
                <div className="invalid-feedback d-block">
                  {validationErrors.review}
                </div>
              )}

              <div className="text-right mt-3">
                <SubmitButton
                  variant="outline-info"
                  className="rounded-pill d-inline-block"
                  isLoading={isProcessing}
                >
                  Update Review
                </SubmitButton>

                <Button
                  variant="outline-dark"
                  className="rounded-pill ml-2"
                  onClick={onCancelEdit}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        )}

        {!isEditing && (
          <div>
            <div dangerouslySetInnerHTML={sanitize.markup(review.review)} />

            {user.id === authUser.id && (
              <div className="text-right">
                <Button
                  variant="outline-primary"
                  onClick={onBeginEdit}
                  disabled={isProcessing}
                  className="rounded-pill"
                >
                  Edit
                </Button>

                <Button
                  variant="outline-danger"
                  onClick={onDelete}
                  disabled={isProcessing}
                  className="rounded-pill ml-2"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </main>
  );
};

Review.propTypes = {
  review: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  authUser: PropTypes.object.isRequired,
  onBeginEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default Review;
