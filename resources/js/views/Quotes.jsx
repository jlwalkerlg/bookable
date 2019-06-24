import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card } from 'react-bootstrap';
import Loading from '../components/Loading';
import sanitize from '../utils/sanitize';

class Quotes extends Component {
  state = {
    loading: true,
    items: null,
    count: null,
    limit: 30
  };

  render() {
    const { loading } = this.state;

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
            {items.map((item, index) => {
              const { quote, book, author } = item.quote;

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
                        in <cite title="Source Title">{book.title}</cite>
                      </footer>
                    </blockquote>
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
