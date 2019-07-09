import React, { Component } from 'react';
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
import Review from './Review';
import Loading from '../../components/Loading';

class ReviewShow extends Component {
  state = {
    isLoading: true,
    error: null,
    review: {},
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
    this.setState({ editorState, isEditing: false });
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const { review } = this.state;

    const editedReview = this.getEditorHtml();

    try {
      const newReview = await updateReview(review.id, editedReview);

      this.setState({
        review: { ...review, ...newReview },
        isEditing: false,
        isProcessing: false
      });
    } catch (error) {
      console.log(error);
      this.setState({ isProcessing: false });
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
      console.log(error);
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
      />
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(ReviewShow);
