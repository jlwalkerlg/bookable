import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import QuoteCard from './QuoteCard';
import { addNotification } from '../actions/notifications';

class QuoteCardContainer extends Component {
  state = {
    isProcessing: false
  };

  source = axios.CancelToken.source();

  componentWillUnmount() {
    this.source.cancel();
  }

  handleSave = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;
    this.setState({ isProcessing: true });

    const { user } = this.props;
    const quoteId = parseInt(e.target.dataset.quoteId);

    try {
      const response = await axios.post(
        `/api/users/${user.id}/quotes`,
        {
          quote_id: quoteId
        },
        {
          cancelToken: this.source.token
        }
      );

      const userQuote = response.data;

      this.props.onSave(quoteId, userQuote);

      this.setState({ isProcessing: false });
    } catch (error) {
      if (axios.isCancel(error)) return;
      this.props.addNotification(`Something went wrong: ${error.message}.`);
      this.setState({ isProcessing: false });
    }
  };

  handleDelete = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;
    this.setState({ isProcessing: true });

    const { user } = this.props;
    const quoteId = parseInt(e.target.dataset.quoteId);

    try {
      await axios.delete(`/api/users/${user.id}/quotes`, {
        cancelToken: this.source.token,
        params: { quote_id: quoteId }
      });

      this.props.onDelete(quoteId);

      this.setState({ isProcessing: false });
    } catch (error) {
      if (axios.isCancel(error)) return;
      this.props.addNotification(`Something went wrong: ${error.message}.`);
      this.setState({ isProcessing: false });
    }
  };

  render() {
    return (
      <QuoteCard
        quote={this.props.quote}
        book={this.props.book}
        author={this.props.author}
        userQuote={this.props.userQuote}
        authUser={this.props.user}
        onSave={this.handleSave}
        onDelete={this.handleDelete}
        isProcessing={this.state.isProcessing}
      />
    );
  }
}

QuoteCardContainer.propTypes = {
  quote: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  userQuote: PropTypes.object,
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  addNotification
};

export default connect(
  null,
  mapDispatchToProps
)(QuoteCardContainer);
