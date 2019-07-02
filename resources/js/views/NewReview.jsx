import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'react-bootstrap';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg/dist/react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import Async from '../components/Async';
import { addReview } from '../actions/reviews';

class NewReview extends Component {
  state = {
    loading: true,
    error: null,
    processing: false,
    book: {},
    editorState: EditorState.createEmpty()
  };

  componentDidMount() {
    this.fetchBook();
  }

  fetchBook = async () => {
    this.setState({ loading: true });
    const { bookId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/books/${bookId}`, {
        params: { with: 'author' }
      });
      const book = response.data;
      this.setState({ book, error: null });
    } catch (error) {
      this.setState({ error: error.response.statusText });
    }
    this.setState({ loading: false });
  };

  onEditorStateChange = editorState => this.setState({ editorState });

  getEditorHtml = () => {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    return draftToHtml(raw);
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { processing } = this.state;
    if (processing) return;

    this.setState({ processing: true });

    const editorReview = this.getEditorHtml();

    const { user } = this.props;
    const { book } = this.state;
    try {
      const review = await addReview(editorReview, book, user);
      this.props.history.push(`/reviews/${review.id}`);
    } catch (error) {
      console.log(error);
      this.setState({ error: error.response.statusText });
      this.setState({ processing: false });
    }
  };

  render() {
    const { loading, error, processing, book, editorState } = this.state;

    return (
      <Async loading={loading} error={error} retry={this.fetchBook}>
        {() => {
          const { author } = book;

          return (
            <main className="section">
              <Container>
                <h1 className="h4">
                  Write a review for{' '}
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h1>
                <p>
                  by <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </p>

                <Form onSubmit={this.handleSubmit}>
                  <Form.Group controlId="review">
                    <Form.Label srOnly>Your review</Form.Label>
                    {/* Draft JS Editor */}
                    <Editor
                      editorState={editorState}
                      wrapperClassName=""
                      toolbarClassName="mb-0"
                      editorClassName="border border-top-0"
                      onEditorStateChange={this.onEditorStateChange}
                    />
                  </Form.Group>
                  <Button
                    disabled={processing}
                    variant="warning"
                    type="submit"
                    className="rounded-pill d-inline-block"
                  >
                    Submit Review
                  </Button>
                </Form>
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

export default connect(mapStateToProps)(NewReview);
