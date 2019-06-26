import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import SlickArrow from '../../components/SlickArrow';
import sanitize from '../../utils/sanitize';
import ProductCard from '../../components/ProductCard';
import FeaturedBook from '../../components/FeaturedBook';
import Async from '../../components/Async';

const slickOptions = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SlickArrow direction="right" />,
  prevArrow: <SlickArrow direction="left" />
};

class Show extends Component {
  state = {
    loading: {
      author: true,
      highestRated: true,
      mostRated: true,
      allBooks: true,
      quotes: true
    },
    errors: {
      author: true,
      highestRated: true,
      mostRated: true,
      allBooks: true,
      quotes: true
    },
    author: null,
    highestRated: null,
    mostRated: null,
    allBooks: null,
    quotes: null
  };

  componentDidMount() {
    this.fetchAuthor();
    this.fetchHighestRated();
    this.fetchMostRated();
    this.fetchAllBooks();
    this.fetchQuotes();
  }

  fetchAuthor = async () => {
    this.setLoading({ author: true });
    const authorId = this.props.match.params.id;
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

  fetchHighestRated = async () => {
    this.setLoading({ highestRated: true });
    const authorId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/books/', {
        params: {
          author_id: authorId,
          order_by: 'avg_rating',
          order_dir: 'desc',
          limit: 1
        }
      });
      const highestRated = response.data.books[0];
      this.setState({ highestRated });
      this.setError({ highestRated: null });
    } catch (error) {
      this.setError({ highestRated: error.response.statusText });
    }
    this.setLoading({ highestRated: false });
  };

  fetchMostRated = async () => {
    this.setLoading({ mostRated: true });
    const authorId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/books/', {
        params: {
          author_id: authorId,
          order_by: 'ratings_count',
          order_dir: 'desc',
          limit: 1
        }
      });
      const mostRated = response.data.books[0];
      this.setState({ mostRated });
      this.setError({ mostRated: null });
    } catch (error) {
      this.setError({ mostRated: error.response.statusText });
    }
    this.setLoading({ mostRated: false });
  };

  fetchAllBooks = async () => {
    this.setLoading({ allBooks: true });
    const authorId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/books/', {
        params: { author_id: authorId }
      });
      const allBooks = response.data.books;
      this.setState({ allBooks });
      this.setError({ allBooks: null });
    } catch (error) {
      this.setError({ allBooks: error.response.statusText });
    }
    this.setLoading({ allBooks: false });
  };

  fetchQuotes = async () => {
    this.setLoading({ quotes: true });
    const authorId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/quotes', {
        params: { author_id: authorId, limit: 5 }
      });
      const { quotes } = response.data;
      this.setState({ quotes });
      this.setError({ quotes: null });
    } catch (error) {
      this.setError({ quotes: error.response.statusText });
    }
    this.setLoading({ quotes: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  render() {
    const {
      loading,
      errors,
      author,
      highestRated,
      mostRated,
      allBooks,
      quotes
    } = this.state;

    return (
      <Async
        loading={loading.author || loading.allBooks}
        error={errors.author || errors.allBooks}
        retry={errors.author ? this.fetchAuthor : this.fetchAllBooks}
      >
        {() => {
          const ratingsCount = allBooks.reduce(
            (prev, current) => prev + current.ratings_count,
            0
          );
          const ratingsSum = allBooks.reduce(
            (prev, current) => prev + current.ratings_sum,
            0
          );
          const avgRating = (ratingsSum / ratingsCount).toFixed(2);

          return (
            <main>
              {/* Header */}
              <header className="section bg-beige text-center">
                <Container>
                  <Row>
                    <Col xs={12} md={6} className="text-md-right mb-3 mb-md-0">
                      <img src={author.large_image_url} alt={author.name} />
                    </Col>
                    <Col xs={12} md={6} className="text-md-left">
                      <h1 className="font-display">{author.name}</h1>
                      <p className="mb-1 font-size-7">
                        <span className="font-weight-bold">Born:</span>{' '}
                        {author.birth_date}
                      </p>
                      <p className="mb-1 font-size-7">
                        <span className="font-weight-bold">Died:</span>{' '}
                        {author.death_date}
                      </p>
                      <p className="mb-1 font-size-7">
                        <span className="font-weight-bold">Hometown:</span>{' '}
                        {author.hometown}
                      </p>
                      <p className="mb-1 font-size-7">
                        <span className="font-weight-bold">
                          Average rating:
                        </span>{' '}
                        {avgRating}
                      </p>
                      <p className="font-size-7">
                        <span className="font-weight-bold">
                          Number of ratings:
                        </span>{' '}
                        {ratingsCount}
                      </p>
                      <p
                        className="text-description text-justify text-md-left"
                        dangerouslySetInnerHTML={sanitize.markup(author.about)}
                      />
                    </Col>
                  </Row>
                </Container>
              </header>

              {/* Highest rated book */}
              <article className="section text-center">
                <Async
                  loading={loading.highestRated}
                  error={errors.highestRated}
                  retry={this.fetchHighestRated}
                >
                  {() => (
                    <FeaturedBook
                      title="Highest rated book"
                      book={highestRated}
                      author={author}
                      variant="left"
                    />
                  )}
                </Async>
              </article>

              {/* Most rated book */}
              <article className="section bg-beige text-center">
                <Async
                  loading={loading.mostRated}
                  error={errors.mostRated}
                  retry={this.fetchMostRated}
                >
                  {() => (
                    <FeaturedBook
                      title="Most rated book"
                      book={mostRated}
                      author={author}
                      variant="right"
                    />
                  )}
                </Async>
              </article>

              {/* All books */}
              <article className="section text-center">
                <h2 className="heading mb-4">
                  <span>All books by {author.name}</span>
                </h2>
                <div className="d-flex flex-wrap justify-content-center">
                  {allBooks.map((book, index) => (
                    <ProductCard key={index} book={book} className="mx-3" />
                  ))}
                </div>
              </article>

              {/* Quotes */}
              <article className="section bg-beige text-center">
                <Container>
                  <h2 className="heading mb-4">
                    <span>Quotes by {author.name}</span>
                  </h2>
                  <div className="px-4">
                    <Async
                      loading={loading.quotes}
                      error={errors.quotes}
                      retry={this.fetchQuotes}
                    >
                      {() => (
                        <Slider {...slickOptions}>
                          {quotes.map((quote, index) => (
                            <div key={index}>
                              <div
                                className="quote mx-4"
                                dangerouslySetInnerHTML={sanitize.markup(
                                  quote.quote
                                )}
                              />
                            </div>
                          ))}
                          <div>
                            <Link
                              to={`/authors/${author.id}/quotes`}
                              className="btn btn-warning rounded-pill"
                            >
                              Read More Quotes
                            </Link>
                          </div>
                        </Slider>
                      )}
                    </Async>
                  </div>
                </Container>
              </article>
            </main>
          );
        }}
      </Async>
    );
  }
}

Show.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Show;
