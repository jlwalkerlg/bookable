import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import withPagination from '../../components/withPagination';
import Quotes from './Quotes';
import Loading from '../../components/Loading';

class QuotesContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    quotes: [],
    user: {},
    count: 0,
    userQuotes: [],
    isProcessing: false
  };

  limit = 10;

  source = axios.CancelToken.source();

  componentDidMount() {
    this.fetchQuotes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoading: true }, this.fetchQuotes);
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchQuotes() {
    const { userId } = this.props.match.params;
    const authUser = this.props.user;

    try {
      const response = await axios.get(`/api/users/${userId}/quotes`, {
        cancelToken: this.source.token,
        params: {
          limit: this.limit,
          offset: this.props.calcOffset(this.limit),
          with: 'book,author',
          count: true
        }
      });

      let { user, quotes, count } = response.data;

      const userQuotes = authUser.id
        ? user.id === authUser.id
          ? quotes
          : await this.fetchUserQuotes(quotes)
        : [];

      quotes = quotes.map(quote => ({
        ...quote,
        userQuote: userQuotes.filter(userQuote => userQuote.id === quote.id)[0]
      }));

      this.setState({ user, quotes, count, userQuotes, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchUserQuotes(quotes) {
    const { user } = this.props;

    const quoteIds = quotes.map(quote => quote.id).join(',');

    const response = await axios.get('/api/quotes', {
      cancelToken: this.source.token,
      params: { user_id: user.id, quote_ids: quoteIds }
    });

    return response.data.quotes;
  }

  handleSaveQuote = async e => {
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

      const quotes = this.state.quotes.map(quote =>
        quote.id !== quoteId ? quote : { ...quote, userQuote }
      );

      const userQuotes = [...this.state.userQuotes, userQuote];

      this.setState({ quotes, userQuotes, isProcessing: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ isProcessing: false });
    }
  };

  handleDeleteQuote = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const { user } = this.props;
    const quoteId = parseInt(e.target.dataset.quoteId);

    try {
      await axios.delete(`/api/users/${user.id}/quotes/${quoteId}`, {
        cancelToken: this.source.token
      });

      const quotes = this.state.quotes.map(quote =>
        quote.id !== quoteId ? quote : { ...quote, userQuote: null }
      );

      const userQuotes = this.state.userQuotes.filter(
        userQuote => userQuote.id !== quoteId
      );

      this.setState({ quotes, userQuotes, isProcessing: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ isProcessing: false });
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
      <Quotes
        quotes={this.state.quotes}
        user={this.state.user}
        authUser={this.props.user}
        isLoading={this.state.isLoading}
        error={this.state.error}
        limit={this.limit}
        count={this.state.count}
        page={this.props.page}
        pathname={this.props.location.pathname}
        onSave={this.handleSaveQuote}
        onDelete={this.handleDeleteQuote}
        isProcessing={this.state.isProcessing}
      />
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default withPagination(connect(mapStateToProps)(QuotesContainer));
