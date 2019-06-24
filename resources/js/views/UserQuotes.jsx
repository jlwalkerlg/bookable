import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import sanitize from '../utils/sanitize';
import URL from '../utils/URL';

class UserQuotes extends Component {
  state = {
    loading: true,
    user: null,
    quotes: null,
    count: null,
    userQuotes: null,
    limit: 10
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.fetchData();
    }
  }

  needsUpdate(prevProps) {
    return (
      prevProps.match.params.userId !== this.props.match.params.userId ||
      prevProps.location.search !== this.props.location.search
    );
  }

  async fetchData() {
    try {
      const [user, { quotes }] = await axios.all([
        this.fetchUser(),
        this.fetchQuotes()
      ]);

      if (this.props.user.id) {
        const quoteIds = quotes.map(quote => quote.id);
        await this.fetchUserQuotes(quoteIds);
      }

      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUser() {
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const user = response.data;
      this.setState({ user });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchQuotes() {
    const { limit } = this.state;
    const offset = this.calcOffset();
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/quotes`, {
        params: {
          user_id: userId,
          limit,
          offset,
          with: 'book,author',
          count: true
        }
      });
      const { quotes, count } = response.data;
      this.setState({ quotes, count });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserQuotes(quoteIds) {
    const { user } = this.props;
    try {
      const response = await axios.get(`/api/users/${user.id}/quotes`, {
        params: { quote_ids: quoteIds.join(',') }
      });
      const userQuotes = response.data.quotes;
      this.setState({ userQuotes });
      return userQuotes;
    } catch (error) {
      console.log(error);
    }
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
    if (!user) return null;

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
    const { loading, user, quotes, count, limit } = this.state;
    const authUser = this.props.user;

    if (loading)
      return (
        <div className="vh-min-100">
          <Loading />
        </div>
      );

    return (
      <div className="section">
        <Container>
          <h1 className="h5 text-uppercase mb-0 mb-md-3">
            {user.name}&apos;s Quotes
          </h1>
          <div className="col-count-2">
            {quotes.map((quote, index) => {
              const { book, author } = quote;
              const userQuote = this.getUserQuote(quote);

              return (
                <Card key={index} className="d-inline-block w-100 mt-3">
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p
                        className="font-size-6"
                        dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
                      />
                      <footer className="blockquote-footer">
                        <Link to={`/authors/${author.name}`}>
                          {author.name}
                        </Link>{' '}
                        in{' '}
                        <cite title="Source Title">
                          <Link to={`/books/${book.id}`}>{book.title}</Link>
                        </cite>
                      </footer>
                    </blockquote>
                    {userQuote && (
                      <Form
                        action="/"
                        method="POST"
                        className="mt-2"
                        onSubmit={e => this.deleteQuote(e, userQuote)}
                      >
                        <Button type="submit" variant="outline-info" size="sm">
                          Unsave
                        </Button>
                      </Form>
                    )}
                    {authUser.id && !userQuote && (
                      <Form
                        action="/"
                        method="POST"
                        className="mt-2"
                        onSubmit={e => this.saveQuote(e, quote)}
                      >
                        <Button type="submit" variant="outline-info" size="sm">
                          Save
                        </Button>
                      </Form>
                    )}
                  </Card.Body>
                </Card>
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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(UserQuotes);
