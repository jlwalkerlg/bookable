import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import withPagination from '../../components/withPagination';
import Loading from '../../components/Loading';
import BookQuotes from './BookQuotes';

class BookQuotesContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    book: {},
    quotes: [],
    userQuotes: [],
    count: 0,
    isProcessing: false
  };

  limit = 10;

  source = axios.CancelToken.source();

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoading: true }, this.fetchData);
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchData() {
    const { user } = this.props;

    try {
      let [book, { quotes, count }] = await axios.all([
        this.fetchBook(),
        this.fetchQuotes()
      ]);

      const userQuotes = user.id
        ? await this.fetchUserQuotes(quotes.map(quote => quote.id).join(','))
        : [];

      quotes = quotes.map(quote => ({
        ...quote,
        userQuote: userQuotes.filter(
          userQuote => userQuote.quote_id === quote.id
        )[0]
      }));

      this.setState({ book, quotes, userQuotes, count, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchBook() {
    const { bookId } = this.props.match.params;

    const response = await axios.get(`/api/books/${bookId}`, {
      cancelToken: this.source.token
    });

    return response.data;
  }

  async fetchQuotes() {
    const { bookId } = this.props.match.params;
    const offset = this.props.calcOffset(this.limit);

    const response = await axios.get(`/api/quotes`, {
      cancelToken: this.source.token,
      params: {
        book_id: bookId,
        limit: this.limit,
        offset,
        with: 'author',
        count: true
      }
    });

    return response.data;
  }

  async fetchUserQuotes(quoteIds) {
    const { user } = this.props;

    const response = await axios.get(`/api/users/${user.id}/quotes`, {
      cancelToken: this.source.token,
      params: { quote_ids: quoteIds }
    });

    return response.data.quotes;
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

      const quotes = this.state.quotes.map(quote =>
        quote.id !== quoteId ? quote : { ...quote, userQuote }
      );

      const userQuotes = [...this.state.userQuotes, userQuote];

      this.setState({ quotes, userQuotes, isProcessing: false });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
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

      const quotes = this.state.quotes.map(quote =>
        quote.id !== quoteId ? quote : { ...quote, userQuote: null }
      );

      const userQuotes = this.state.userQuotes.filter(
        userQuote => userQuote.id !== quoteId
      );

      this.setState({ quotes, userQuotes, isProcessing: false });
    } catch (error) {
      if (axios.isCancel(error)) return;
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
      <BookQuotes
        book={this.state.book}
        quotes={this.state.quotes}
        user={this.props.user}
        onSave={this.handleSave}
        onDelete={this.handleDelete}
        count={this.state.count}
        page={this.props.page}
        pathname={this.props.location.pathname}
        limit={this.limit}
        isProcessing={this.state.isProcessing}
      />
    );
  }
}

BookQuotesContainer.propTypes = {
  user: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  calcOffset: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default withPagination(connect(mapStateToProps)(BookQuotesContainer));
