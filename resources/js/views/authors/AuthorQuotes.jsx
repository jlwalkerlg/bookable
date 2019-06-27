import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Async from '../../components/Async';
import Pagination from '../../components/Pagination';
import URL from '../../utils/URL';
import QuoteCard from '../../components/QuoteCard';

class UserQuotes extends Component {
  state = {
    loading: {
      author: true,
      quotes: true,
      userQuotes: true
    },
    errors: {
      author: null,
      quotes: null,
      userQuotes: null
    },
    author: null,
    quotes: null,
    userQuotes: null,
    count: null,
    limit: 10
  };

  componentDidMount() {
    this.fetchAuthor();
    this.fetchQuotes();
  }

  componentDidUpdate(prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.fetchAuthor();
      this.fetchQuotes();
    }
  }

  needsUpdate(prevProps) {
    return prevProps.location.search !== this.props.location.search;
  }

  fetchAuthor = async () => {
    this.setLoading({ author: true });

    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/authors/${authorId}`);
      const author = response.data;
      this.setState({ author });
      this.setError({ author: null });
    } catch (error) {
      this.setError({ author: error.response.statusText });
    }
    this.setLoading({ author: false });
  };

  fetchQuotes = async () => {
    this.setLoading({ quotes: true });

    const { limit } = this.state;
    const offset = this.calcOffset();
    const { authorId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/quotes`, {
        params: {
          author_id: authorId,
          limit,
          offset,
          with: 'book',
          count: true
        }
      });
      const { quotes, count } = response.data;
      this.setState({ quotes, count });
      this.setError({ quotes: null });

      this.fetchUserQuotes(quotes);
    } catch (error) {
      this.setError({ quotes: error.response.statusText });
      this.setLoading({ userQuotes: false });
    }
    this.setLoading({ quotes: false });
  };

  fetchUserQuotes = async quotes => {
    this.setLoading({ userQuotes: true });

    const { user } = this.props;
    if (!user.id) {
      this.setError({ userQuotes: null });
      this.setLoading({ userQuotes: false });
      return;
    }

    const quoteIds = (quotes || this.state.quotes).map(quote => quote.id);
    try {
      const response = await axios.get(`/api/users/${user.id}/quotes`, {
        params: { quote_ids: quoteIds.join(',') }
      });
      const userQuotes = response.data.quotes;
      this.setState({ userQuotes });
      this.setError({ userQuotes: null });
    } catch (error) {
      console.log(error);
      this.setError({ userQuotes: error.response.statusText });
    }
    this.setLoading({ userQuotes: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  calcOffset() {
    const page = this.getCurrentPage();
    const { limit } = this.state;
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return (
      parseInt(URL.query(this.props.location.search).getParam('page')) || 1
    );
  }

  getUserQuote(quote) {
    const { user } = this.props;
    if (!user.id) return null;

    const { userQuotes } = this.state;
    return userQuotes.filter(userQuote => userQuote.quote_id === quote.id)[0];
  }

  deleteQuote = async (e, userQuote) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/user-quotes/${userQuote.id}`);
      const userQuotes = this.state.userQuotes.filter(
        authQuote => authQuote.id !== userQuote.id
      );
      this.setState({ userQuotes });
    } catch (error) {
      console.log(error);
    }
  };

  saveQuote = async (e, quote) => {
    e.preventDefault();
    const { user } = this.props;
    try {
      const response = await axios.post(`/api/users/${user.id}/quotes`, {
        quote_id: quote.id
      });
      const userQuotes = [...this.state.userQuotes, response.data];
      this.setState({ userQuotes });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading, errors, author, quotes, count, limit } = this.state;
    const authUser = this.props.user;

    return (
      <div className="section">
        <Container>
          <Async
            loading={loading.author}
            error={errors.author}
            retry={this.fetchBook}
          >
            {() => (
              <>
                <h1 className="h5 text-uppercase mb-0 mb-md-3">
                  Quotes by{' '}
                  <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </h1>
                <Async
                  loading={loading.quotes || loading.userQuotes}
                  error={errors.quotes || errors.userQuotes}
                  retry={
                    errors.quotes
                      ? this.fetchQuotes
                      : () => this.fetchUserQuotes()
                  }
                >
                  {() => (
                    <>
                      <div className="col-count-2">
                        {quotes.map((quote, index) => {
                          const { book } = quote;
                          const userQuote = this.getUserQuote(quote);

                          return (
                            <QuoteCard
                              key={index}
                              quote={quote}
                              book={book}
                              author={author}
                              userQuote={userQuote}
                              authUser={authUser}
                              onSave={this.saveQuote}
                              onDelete={this.deleteQuote}
                            />
                          );
                        })}
                      </div>
                      <Pagination
                        totalItems={count}
                        currentPage={this.getCurrentPage()}
                        pageSize={limit}
                        maxPages={5}
                        url={`${this.props.location.pathname}?page=`}
                        className="justify-content-center pagination-warning mt-4"
                      />
                    </>
                  )}
                </Async>
              </>
            )}
          </Async>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(UserQuotes);
