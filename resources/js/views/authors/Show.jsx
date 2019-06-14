import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import TempProductCard from '../../components/TempProductCard';
import SlickArrow from '../../components/SlickArrow';
import Loading from '../../components/Loading';
import sanitize from '../../utils/sanitize';
import ProductCard from '../../components/ProductCard';

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
    loading: true,
    author: null
  };

  async componentDidMount() {
    const author = await this.fetchAuthor();
    this.setState({ author, loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loading: true });
      const author = await this.fetchAuthor();
      this.setState({ author, loading: false });
    }
  }

  async fetchAuthor() {
    const authorId = this.props.match.params.id;
    try {
      const result = await axios.get(`/api/authors/${authorId}`);
      const author = result.data;
      return author;
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { loading, author } = this.state;

    if (loading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    const totalRatingsCount = author.books.reduce(
      (prev, current) => prev + current.ratings_count,
      0
    );

    const totalRatingsSum = author.books.reduce(
      (prev, current) => prev + current.ratings_sum,
      0
    );

    const avgRating = (totalRatingsSum / totalRatingsCount).toFixed(2);

    const highestRated = author.books.reduce((prev, current) =>
      prev.avg_rating > current.avg_rating ? prev : current
    );

    const mostRated = author.books.reduce((prev, current) =>
      prev.ratings_count > current.ratings_count ? prev : current
    );

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
                  <span className="font-weight-bold">Average rating:</span>{' '}
                  {avgRating}
                </p>
                <p className="font-size-7">
                  <span className="font-weight-bold">Number of ratings:</span>{' '}
                  {totalRatingsCount}
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
          <Container>
            <Row>
              <Col xs={12} md={6} className="offset-md-6">
                <h2 className="heading heading--left-md text-md-left mb-4">
                  <span>Highest rated book</span>
                </h2>
              </Col>
              <Col xs={12} md={6} className="mb-3 mb-md-0 text-md-right">
                <img
                  src={highestRated.large_image_url}
                  alt={highestRated.title}
                  className="book-highlight"
                />
              </Col>
              <Col xs={12} md={6} className="text-md-left">
                <p className="h1 font-display font-weight-bold text-break">
                  <Link to={`/books/${highestRated.id}`}>
                    {highestRated.title}
                  </Link>
                </p>
                <p>
                  <span className="text-secondary">by:</span>{' '}
                  <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </p>
                <p className="h2 font-weight-bold text-warning mb-4">
                  £{highestRated.price}
                </p>
                <p
                  className="text-description text-justify text-md-left"
                  dangerouslySetInnerHTML={sanitize.markup(
                    highestRated.description
                  )}
                />
                <Link
                  to={`/books/${highestRated.id}`}
                  className="btn btn-warning btn-md rounded-pill text-uppercase"
                >
                  Read More
                </Link>
              </Col>
            </Row>
          </Container>
        </article>
        {/* Most rated book */}
        <article className="section bg-beige text-center">
          <Container>
            <Row>
              <Col xs={12} md={6}>
                <h2 className="heading heading--right-md text-md-right mb-4">
                  <span>Most rated book</span>
                </h2>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                md={{ span: 6, order: 2 }}
                className="mb-3 mb-md-0 text-md-left"
              >
                <img
                  src={mostRated.large_image_url}
                  alt={mostRated.title}
                  className="book-highlight"
                />
              </Col>
              <Col xs={12} md={{ span: 6, order: 1 }} className="text-md-right">
                <p className="h1 font-display font-weight-bold text-break">
                  <Link to="/books/1">{mostRated.title}</Link>
                </p>
                <p>
                  <span className="text-secondary">by:</span>{' '}
                  <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </p>

                <p className="h2 font-weight-bold text-warning mb-4">£12.00</p>
                <p
                  className="text-description text-justify text-md-right"
                  dangerouslySetInnerHTML={sanitize.markup(
                    mostRated.description
                  )}
                />
                <Link
                  to={`/books/${mostRated.id}`}
                  className="btn btn-warning btn-md rounded-pill text-uppercase"
                >
                  Read More
                </Link>
              </Col>
            </Row>
          </Container>
        </article>
        {/* All books */}
        <article className="section text-center">
          <h2 className="heading mb-4">
            <span>All books by {author.name}</span>
          </h2>
          <div className="d-flex flex-wrap justify-content-center">
            {author.books.map((book, index) => (
              <ProductCard key={index} book={book} />
            ))}
          </div>
        </article>
        {/* Quotes */}
        <article
          className="section bg-beige text-center"
          style={{ overflow: 'hidden' }}
        >
          <Container>
            <h2 className="heading mb-4">
              <span>Quotes by {author.name}</span>
            </h2>
            <div className="px-2">
              <Slider {...slickOptions}>
                {new Array(5).fill(0).map((item, index) => (
                  <div key={index}>
                    <div className="quote mx-4">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dignissimos nobis voluptatum excepturi eum maiores.
                      Architecto, voluptatibus nam. Animi iure ea voluptatem
                      distinctio doloribus fugiat, minima, laborum voluptatibus
                      qui totam eveniet ex. Cumque, distinctio itaque facilis
                      dolor est quidem sunt reprehenderit necessitatibus in
                      dicta sit, asperiores sapiente illum quis similique
                      numquam?
                    </div>
                  </div>
                ))}
                <div>
                  <Link to="/" className="btn btn-warning rounded-pill">
                    Read More Quotes
                  </Link>
                </div>
              </Slider>
            </div>
          </Container>
        </article>
      </main>
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
