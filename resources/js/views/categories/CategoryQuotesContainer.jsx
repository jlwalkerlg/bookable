import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Loading from '../../components/Loading';
import CategoryQuotes from './CategoryQuotes';
import withPagination from '../../components/withPagination';

class CategoryQuotesContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    category: {},
    quotes: [],
    userQuotes: [],
    count: 0
  };

  limit = 10;

  source = axios.CancelToken.source();

  componentWillUnmount() {
    this.source.cancel();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoading: true }, this.fetchData);
    }
  }

  async fetchData() {
    const { user } = this.props;

    try {
      let [category, { quotes, count }] = await axios.all([
        this.fetchCategory(),
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

      this.setState({ category, quotes, userQuotes, count, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  async fetchCategory() {
    const { categoryId } = this.props.match.params;

    const response = await axios.get(`/api/categories/${categoryId}`, {
      cancelToken: this.source.token
    });

    return response.data;
  }

  async fetchQuotes() {
    const { categoryId } = this.props.match.params;
    const offset = this.props.calcOffset(this.limit);

    const response = await axios.get(`/api/quotes`, {
      cancelToken: this.source.token,
      params: {
        category_id: categoryId,
        limit: this.limit,
        offset,
        with: 'book,author',
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

  handleSave = (quoteId, userQuote) => {
    const quotes = this.state.quotes.map(quote =>
      quote.id !== quoteId ? quote : { ...quote, userQuote }
    );

    const userQuotes = [...this.state.userQuotes, userQuote];

    this.setState({ quotes, userQuotes });
  };

  handleDelete = quoteId => {
    const quotes = this.state.quotes.map(quote =>
      quote.id !== quoteId ? quote : { ...quote, userQuote: null }
    );

    const userQuotes = this.state.userQuotes.filter(
      userQuote => userQuote.id !== quoteId
    );

    this.setState({ quotes, userQuotes });
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
      <CategoryQuotes
        category={this.state.category}
        quotes={this.state.quotes}
        user={this.props.user}
        count={this.state.count}
        page={this.props.page}
        pathname={this.props.location.pathname}
        limit={this.limit}
        onSave={this.handleSave}
        onDelete={this.handleDelete}
      />
    );
  }
}

CategoryQuotesContainer.propTypes = {
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

export default withPagination(
  connect(mapStateToProps)(CategoryQuotesContainer)
);
