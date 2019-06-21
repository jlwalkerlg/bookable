import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import Slider from 'react-slick';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SlickArrow from '../components/SlickArrow';
import Loading from '../components/Loading';
import sanitize from '../utils/sanitize';

const slickOptions = {
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  nextArrow: <SlickArrow direction="right" />,
  prevArrow: <SlickArrow direction="left" />,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      }
    }
  ]
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      bestSeller: null,
      newBooks: null,
      featuredBooks: null,
      penguinBooks: null,
      trendingCategory: props.categories[0],
      trendingCategoryBook: null
    };
  }

  async componentDidMount() {
    const [
      bestSeller,
      newBooks,
      featuredBooks,
      penguinBooks,
      trendingCategoryBook
    ] = await this.fetchData();
    this.setState({
      bestSeller: bestSeller.data.books[0],
      newBooks: newBooks.data.books,
      featuredBooks: featuredBooks.data.books,
      penguinBooks: penguinBooks.data.books,
      trendingCategoryBook: trendingCategoryBook.data.books[0],
      loading: false
    });
  }

  async fetchData() {
    try {
      const res = await axios.all([
        this.fetchBestSeller(),
        this.fetchNewBooks(),
        this.fetchFeaturedBooks(),
        this.fetchPenguinBooks(),
        this.fetchTrendingCategory()
      ]);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  fetchBestSeller() {
    return axios.get('/api/books', {
      params: {
        limit: 1,
        order_by: 'ratings_count',
        order_dir: 'desc',
        with: 'author'
      }
    });
  }

  fetchNewBooks() {
    return axios.get('/api/books', {
      params: {
        limit: 15,
        order_by: 'publication_date',
        order_dir: 'desc',
        with: 'author'
      }
    });
  }

  fetchFeaturedBooks() {
    return axios.get('/api/books', {
      params: { limit: 15, order_by: 'random', with: 'author' }
    });
  }

  fetchPenguinBooks() {
    return axios.get('/api/books', {
      params: {
        limit: 15,
        publisher: 'Penguin Books',
        with: 'author'
      }
    });
  }

  async fetchTrendingCategory() {
    const { trendingCategory } = this.state;
    return axios.get('/api/books', {
      params: {
        limit: 1,
        order_by: 'ratings_count',
        order_dir: 'desc',
        category_id: trendingCategory.id,
        with: 'author'
      }
    });
  }

  render() {
    const {
      loading,
      bestSeller,
      newBooks,
      featuredBooks,
      penguinBooks,
      trendingCategory,
      trendingCategoryBook
    } = this.state;

    return loading ? (
      <div className="vh-100-nav">
        <Loading />
      </div>
    ) : (
      <>
        {/* SITE HEAD */}
        <header className="site-head">
          <div className="text-center">
            <h1 className="site-head__title">Welcome to Bookable</h1>
            <p className="mb-4 site-head__subtitle">Fall in love with books.</p>
            <Link
              to="/"
              className="btn btn-outline-light btn-lg rounded-pill site-head__cta"
            >
              Shop Now
            </Link>
          </div>
        </header>
        {/* BEST SELLER */}
        <article className="bg-beige section text-center">
          <Container>
            <Row>
              <Col xs={12} lg={4} className="mb-4 mb-lg-0 text-lg-right">
                <h2 className="heading heading--right-md mb-5">
                  <span>Best Seller</span>
                </h2>
                <p className="h1 font-display font-weight-bold text-break">
                  <Link to={`/books/${bestSeller.id}`}>{bestSeller.title}</Link>
                </p>
                <p>
                  <span className="text-secondary">by:</span>{' '}
                  <Link to={`/authors/${bestSeller.author.id}`}>
                    {bestSeller.author.name}
                  </Link>
                </p>
                <p className="h2 font-weight-bold text-warning">
                  £{bestSeller.price}
                </p>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-5 mb-md-0">
                <img
                  src={bestSeller.large_image_url}
                  alt={bestSeller.title}
                  className="d-block mx-auto book-highlight"
                />
              </Col>
              <Col
                xs={12}
                md={6}
                lg={4}
                className="d-flex align-items-end text-md-left"
              >
                <div>
                  <p
                    className="text-description"
                    dangerouslySetInnerHTML={sanitize.markup(
                      bestSeller.description
                    )}
                  />
                  <Link
                    to={`/books/${bestSeller.id}`}
                    className="btn btn-warning btn-md rounded-pill text-uppercase"
                  >
                    Read More
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </article>
        {/* NEW BOOKS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>New Books</span>
            </h2>
            <Slider {...slickOptions} className="text-center">
              {newBooks.map((book, index) => (
                <ProductCard
                  key={index}
                  book={book}
                  className={index % 2 !== 0 ? 'mt-lg-4' : ''}
                />
              ))}
            </Slider>
          </Container>
        </article>
        {/* FEATURED BOOKS */}
        <article className="section text-center bg-beige">
          <h2 className="heading mb-5">
            <span>Featured Books</span>
          </h2>
          <Container>
            <Slider {...slickOptions} className="text-center">
              {featuredBooks.map((book, index) => (
                <ProductCard
                  key={index}
                  book={book}
                  className={index % 2 !== 0 ? 'mt-lg-4' : ''}
                />
              ))}
            </Slider>
          </Container>
        </article>
        {/* PENGUIN CLASSICS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>Penguin Classics</span>
            </h2>
            <div className="d-flex justify-content-center flex-wrap">
              {penguinBooks.map((book, index) => (
                <ProductCard key={index} book={book} className="mb-4 mx-3" />
              ))}
            </div>
          </Container>
        </article>
        {/* PHILOSOPHY FEATURE */}
        <article className="bg-beige section text-center">
          <Container>
            <Row>
              <Col xs={12} md={6} className="offset-md-6">
                <h2 className="heading heading--left-md text-md-left mb-4">
                  <span>Trending in</span>{' '}
                  <Link to={`/categories/${trendingCategory.id}`}>
                    {trendingCategory.name}
                  </Link>
                </h2>
              </Col>
              <Col xs={12} md={6} className="mb-3 mb-md-0 text-md-right">
                <img
                  src={trendingCategoryBook.large_image_url}
                  alt={trendingCategoryBook.title}
                  className="book-highlight"
                />
              </Col>
              <Col xs={12} md={6} className="text-md-left">
                <p className="h1 font-display font-weight-bold text-break">
                  <Link to={`/books/${trendingCategoryBook.id}`}>
                    {trendingCategoryBook.title}
                  </Link>
                </p>
                <p>
                  <span className="text-secondary">by:</span>{' '}
                  <Link to={`/authors/${trendingCategoryBook.author.id}`}>
                    {trendingCategoryBook.author.name}
                  </Link>
                </p>
                <p className="h2 font-weight-bold text-warning mb-4">
                  £{trendingCategoryBook.price}
                </p>
                <p
                  className="text-description"
                  dangerouslySetInnerHTML={sanitize.markup(
                    trendingCategoryBook.description
                  )}
                />
                <Link
                  to={`/books/${trendingCategoryBook.id}`}
                  className="btn btn-warning btn-md rounded-pill text-uppercase"
                >
                  Read More
                </Link>
              </Col>
            </Row>
          </Container>
        </article>
      </>
    );
  }
}

const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps)(Home);
