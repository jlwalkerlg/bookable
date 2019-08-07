import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { addReview } from '../../actions/reviews';
import Loading from '../../components/Loading';
import ReviewForm from '../../components/ReviewForm';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

class NewReview extends Component {
  state = {
    isLoading: true,
    error: null,
    book: {},
    validationErrors: {},
    editorState: EditorState.createEmpty(),
    isProcessing: false,
  };

  async componentDidMount() {
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get(`/api/books/${bookId}`);

      const book = response.data;

      this.setState({ book, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  handleEditorChange = editorState => this.setState({ editorState });

  getEditorHtml() {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    return draftToHtml(raw);
  }

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true, error: null, validationErrors: {} });

    const editorReview = this.getEditorHtml();

    const { user } = this.props;
    const { book } = this.state;

    try {
      const review = await addReview(editorReview, book, user.id);

      this.props.history.push(`/reviews/${review.id}`);
    } catch (error) {
      this.setState({
        error,
        validationErrors: error.response.data.errors || {},
        isProcessing: false,
      });
    }
  };

  render() {
    const { isLoading, error } = this.state;

    if (isLoading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    return (
      <main className="section">
        <Container>
          {error && (
            <Alert variant="danger">
              Something went wrong: {error.message}.
            </Alert>
          )}

          <ReviewForm
            user={this.props.user}
            onChange={this.handleEditorChange}
            onSubmit={this.handleSubmit}
            editorState={this.state.editorState}
            book={this.state.book}
            isProcessing={this.state.isProcessing}
            validationErrors={this.state.validationErrors}
          />
        </Container>
      </main>
    );
  }
}

NewReview.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ user }) => ({
  user,
});

export default connect(mapStateToProps)(NewReview);
