import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg/dist/react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import Async from '../components/Async';
import { updateReview, deleteReview } from '../actions/reviews';
import sanitize from '../utils/sanitize';

class ReviewShow extends Component {
  state = {
    loading: true,
    error: null,
    processing: false,
    editing: false,
    editError: null,
    editorState: EditorState.createEmpty(),
    review: {}
  };

  async componentDidMount() {
    const review = await this.fetchReview();
    this.initEditor(review.review);
  }

  initEditor(html) {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    const editorState = EditorState.createWithContent(state);
    this.setState({ editorState });
  }

  fetchReview = async () => {
    this.setState({ loading: true });
    const { reviewId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/reviews/${reviewId}`, {
        params: { with: 'user,book.author' }
      });
      const review = response.data;
      this.setState({ review, error: null, loading: false });
      return review;
    } catch (error) {
      this.setState({ error: error.response.statusText });
    }
    this.setState({ loading: false });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { review, processing } = this.state;
    const editedReview = this.getEditorHtml();

    if (processing) return;

    this.setState({ processing: true });

    try {
      const newReview = await updateReview(review, editedReview);

      this.setState({
        review: { ...review, ...newReview },
        editing: false,
        editError: null
      });
    } catch (error) {
      this.setState({ editError: error.response.statusText });
    }
    this.setState({ processing: false });
  };

  deleteReview = async () => {
    const { user } = this.props;
    const { review } = this.state;
    this.setState({ processing: true });
    try {
      await deleteReview(review);
      return this.props.history.push(`/users/${user.id}/reviews`);
    } catch (error) {
      console.log(error);
      this.setState({ processing: false });
    }
  };

  onEditorStateChange = editorState => this.setState({ editorState });

  getEditorHtml = () => {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    return draftToHtml(raw);
  };

  toggleEdit = () => this.setState({ editing: true });

  cancelEdit = () => {
    this.initEditor(this.state.review.review);
    this.setState({ editing: false });
  };

  render() {
    const {
      review,
      loading,
      error,
      processing,
      editing,
      editorState,
      editError
    } = this.state;
    const authUser = this.props.user;

    return (
      <Async loading={loading} error={error} retry={this.fetchReview}>
        {() => {
          const { user, book } = review;
          const { author } = book;

          return (
            <main className="section">
              <Container>
                <h1 className="h4">
                  {user.name}'s review for{' '}
                  <Link to={`/books/${book.id}`}>{book.title}</Link> by{' '}
                  <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </h1>

                {editing && (
                  <div>
                    <Form onSubmit={this.handleSubmit}>
                      {/* Draft JS Editor */}
                      <Editor
                        editorState={editorState}
                        wrapperClassName=""
                        toolbarClassName="mb-0"
                        editorClassName="border border-top-0"
                        onEditorStateChange={this.onEditorStateChange}
                      />

                      <Button
                        disabled={processing}
                        variant="info"
                        type="submit"
                        className="rounded-pill d-inline-block"
                      >
                        Update Review
                        {processing && (
                          <Spinner
                            className="align-text-bottom ml-2"
                            size="sm"
                            animation="border"
                            role="status"
                          />
                        )}
                      </Button>
                    </Form>
                    <Button onClick={this.cancelEdit} disabled={processing}>
                      Cancel
                    </Button>
                  </div>
                )}

                {!editing && (
                  <div>
                    <div
                      dangerouslySetInnerHTML={sanitize.markup(review.review)}
                    />
                    {user.id === authUser.id && (
                      <>
                        <Button onClick={this.toggleEdit}>Edit</Button>
                        <Button onClick={this.deleteReview} variant="danger">
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Container>
            </main>
          );
        }}
      </Async>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(ReviewShow);
