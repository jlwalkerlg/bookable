import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import sanitize from '../utils/sanitize';

class Quotes extends Component {
  state = {
    loading: true,
    user: null,
    userQuotes: null,
    count: null,
    authUserQuotes: null,
    limit: 10
  };

  componentDidMount() {
    this.fetchQuotes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchQuotes();
    }
  }

  async fetchQuotes() {
    const { userId } = this.props.match.params;

    const areOwnQuotes = parseInt(userId) === this.props.user.id;

    try {
      const { user, quotes } = await this.fetchUserQuotes();
      const userQuotes = quotes;

      if (areOwnQuotes)
        return this.setState({
          user,
          userQuotes: null,
          authUserQuotes: userQuotes,
          loading: false
        });

      const quoteIds = userQuotes.map(userQuote => userQuote.quote.id);
      const authUserQuotes =
        this.props.user.id && (await this.fetchAuthUserQuotes(quoteIds)).quotes;

      return this.setState({
        user,
        userQuotes,
        authUserQuotes,
        loading: false
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserQuotes() {
    const { limit } = this.state;
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}/quotes`, {
        params: { limit, with: 'quote.book,quote.author' }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAuthUserQuotes(quoteIds) {
    const { user } = this.props;
    try {
      const response = await axios.get(`/api/users/${user.id}/quotes`, {
        params: { quote_ids: quoteIds.join(',') }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  getAuthQuote(userQuote) {
    const { userQuotes, authUserQuotes } = this.state;
    if (!userQuotes) return userQuote;
    if (!authUserQuotes) return null;
    return authUserQuotes.filter(
      authQuote => authQuote.quote_id === userQuote.quote_id
    )[0];
  }

  deleteQuote = async (e, userQuote) => {
    e.preventDefault();
    const { userQuotes, authUserQuotes } = this.state;
    const authQuote = !userQuotes
      ? userQuote
      : authUserQuotes.filter(
          quote => quote.quote_id === userQuote.quote_id
        )[0];
    try {
      await axios.delete(`/api/user-quotes/${authQuote.id}`);
      const newAuthUserQuotes = authUserQuotes.filter(
        quote => quote.id !== authQuote.id
      );
      this.setState({ authUserQuotes: newAuthUserQuotes });
    } catch (error) {
      console.log(error);
    }
  };

  saveQuote = async (e, userQuote) => {
    e.preventDefault();
    const { user } = this.props;
    const areOwnQuotes = !this.state.userQuotes;
    try {
      const response = await axios.post(`/api/users/${user.id}/quotes`, {
        quote_id: userQuote.quote_id,
        with: areOwnQuotes ? 'quote.book,quote.author' : null
      });
      const authUserQuotes = [...this.state.authUserQuotes, response.data];
      this.setState({ authUserQuotes });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading, user, userQuotes, authUserQuotes } = this.state;
    const authUser = this.props.user;

    if (loading)
      return (
        <div className="vh-min-100">
          <Loading />
        </div>
      );

    const areOwnQuotes = user.id === authUser.id;

    return (
      <div className="section">
        <Container>
          <h1 className="h5 text-uppercase mb-0 mb-md-3">
            {user.name}&apos;s Quotes
          </h1>
          <div className="col-count-2">
            {(userQuotes || authUserQuotes).map((userQuote, index) => {
              const { quote, book, author } = userQuote.quote;
              const authQuote = this.getAuthQuote(userQuote);

              return (
                <Card key={index} className="d-inline-block w-100 mt-3">
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p
                        className="font-size-6"
                        dangerouslySetInnerHTML={sanitize.markup(quote)}
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
                    {(areOwnQuotes || authQuote) && (
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
                    {!areOwnQuotes && !authQuote && authUser.id && (
                      <Form
                        action="/"
                        method="POST"
                        className="mt-2"
                        onSubmit={e => this.saveQuote(e, userQuote)}
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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ quotes, user }) => ({
  quotes,
  user
});

export default connect(mapStateToProps)(Quotes);
