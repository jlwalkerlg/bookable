import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import SlickArrow from '../components/SlickArrow';

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

const Home = () => (
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
              <Link to="/books/1">The Adventures of Huckleberry Finn</Link>
            </p>
            <p>
              <span className="text-secondary">by:</span>{' '}
              <Link to="/authors/1">Mark Twain</Link>
            </p>
            <p className="h2 font-weight-bold text-warning">£15.99</p>
          </Col>
          <Col xs={12} md={6} lg={4} className="mb-5 mb-md-0">
            <img
              src="https://images.gr-assets.com/books/1546096879l/2956.jpg"
              alt="The Adventures of Huckleberry Finn"
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
              <p className="text-description">
                A nineteenth-century boy from a Mississippi River town recounts
                his adventures as he travels down the river with a runaway
                slave, encountering a family involved in a feud, two scoundrels
                pretending to be royalty, and Tom Sawyer's aunt who mistakes him
                for Tom.
              </p>
              <Link
                to="/books/1"
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
          {new Array(15).fill(0).map((item, index) => (
            <ProductCard
              key={index}
              image="https://images.gr-assets.com/books/1440319389m/4981.jpg"
              title="Slaughterhouse-Five"
              author="Kurt Vonnegut"
              price={7.99}
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
        <div className="d-flex justify-content-center flex-wrap">
          {new Array(8).fill(0).map((item, index) => (
            <ProductCard
              key={index}
              image="https://images.gr-assets.com/books/1546091617m/15823480.jpg"
              title="Anna Karenina"
              author="Leo Tolstoy"
              price={12.99}
              className="mb-4 mx-3"
            />
          ))}
        </div>
      </Container>
    </article>
    {/* PENGUIN CLASSICS */}
    <article className="section text-center">
      <Container>
        <h2 className="heading mb-5">
          <span>Penguin Classics</span>
        </h2>
        <Slider {...slickOptions} className="text-center">
          {new Array(15).fill(0).map((item, index) => (
            <ProductCard
              key={index}
              image="https://images.gr-assets.com/books/1546112331m/3836.jpg"
              title="Don Quixote"
              author="Miguel de Cervantes Saavedra"
              price={11.99}
            />
          ))}
        </Slider>
      </Container>
    </article>
    {/* PHILOSOPHY FEATURE */}
    <article className="bg-beige section text-center">
      <Container>
        <Row>
          <Col xs={12} md={6} className="offset-md-6">
            <h2 className="heading heading--left-md text-md-left mb-4">
              <span>Trending in</span> <Link to="/">Philosophy</Link>
            </h2>
          </Col>
          <Col xs={12} md={6} className="mb-3 mb-md-0 text-md-right">
            <img
              src="https://images.gr-assets.com/books/1522157426l/19063.jpg"
              alt="The Book Thief"
              className="book-highlight"
            />
          </Col>
          <Col xs={12} md={6} className="text-md-left">
            <p className="h1 font-display font-weight-bold text-break">
              <Link to="/books/1">The Book Thief</Link>
            </p>
            <p>
              <span className="text-secondary">by:</span>{' '}
              <Link to="/authors/1">Markus Zusak</Link>
            </p>
            <p className="h2 font-weight-bold text-warning mb-4">£19.99</p>
            <p className="text-description">
              A nineteenth-century boy from a Mississippi River town recounts
              his adventures as he travels down the river with a runaway slave,
              encountering a family involved in a feud, two scoundrels
              pretending to be royalty, and Tom Sawyer's aunt who mistakes him
              for Tom.
            </p>
            <Link
              to="/books/1"
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

export default Home;
