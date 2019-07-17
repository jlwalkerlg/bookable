import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { updateReview, deleteReview } from '../../actions/reviews';
import { addNotification } from '../../actions/notifications';
import Review from './Review';
import Loading from '../../components/Loading';

class ReviewContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    review: {},
    validationErrors: {},
    editorState: EditorState.createEmpty(),
    isProcessing: false,
    isEditing: false
  };

  async componentDidMount() {
    try {
      const review = await this.fetchReview();
      const editorState = this.getEditorState(review.review);
      this.setState({ review, editorState, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  async fetchReview() {
    const { reviewId } = this.props.match.params;

    const response = await axios.get(`/api/reviews/${reviewId}`, {
      params: { with: 'user,book' }
    });

    return response.data;
  }

  getEditorState(html) {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(state);
  }

  getEditorHtml() {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    return draftToHtml(raw);
  }

  handleEditorChange = editorState => this.setState({ editorState });

  handleBeginEdit = () => this.setState({ isEditing: true });

  handleCancelEdit = () => {
    const editorState = this.getEditorState(this.state.review.review);
    this.setState({
      editorState,
      isEditing: false,
      error: null,
      validationErrors: {}
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true, error: null, validationErrors: {} });

    const { review } = this.state;

    const editedReview = this.getEditorHtml();

    try {
      const newReview = await updateReview(review.id, editedReview);

      this.setState({
        review: { ...review, ...newReview },
        validationErrors: {},
        error: null,
        isEditing: false,
        isProcessing: false
      });
    } catch (error) {
      this.setState({
        validationErrors: error.response.data.errors || {},
        isProcessing: false
      });
    }
  };

  handleDelete = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    if (!confirm('Are you sure you wish to delete your review?')) return;

    this.setState({ isProcessing: true });

    const { user } = this.props;
    const { review } = this.state;

    try {
      await deleteReview(review.id);
      this.props.history.push(`/users/${user.id}/reviews`);
    } catch (error) {
      this.props.addNotification(`Something went wrong: ${error.message}.`);
      this.setState({ isProcessing: false });
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

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <Review
        review={this.state.review}
        onSubmit={this.handleSubmit}
        onDelete={this.handleDelete}
        isEditing={this.state.isEditing}
        editorState={this.state.editorState}
        onChange={this.handleEditorChange}
        isProcessing={this.state.isProcessing}
        authUser={this.props.user}
        onBeginEdit={this.handleBeginEdit}
        onCancelEdit={this.handleCancelEdit}
        validationErrors={this.state.validationErrors}
      />
    );
  }
}

ReviewContainer.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      reviewId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

const mapDispatchToProps = {
  addNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContainer);
