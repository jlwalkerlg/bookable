import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Scrollspy from 'react-scrollspy';
import Slider from 'react-slick';
import Stars from '../../components/Stars';
import ProductCard from '../../components/ProductCard';
import SlickArrow from '../../components/SlickArrow';

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

class Show extends Component {
  state = {
    quantity: 1,
    inCart: false,
    inWishlist: false,
    rating: 0
  };

  changeQuantity = e => {
    this.setState({ quantity: e.target.value });
  };

  toggleCart = e => {
    e.preventDefault();
    this.setState({ inCart: !this.state.inCart });
  };

  toggleWishlist = e => {
    e.preventDefault();
    this.setState({ inWishlist: !this.state.inWishlist });
  };

  handleRating = e => {
    const rating = 5 - parseInt(e.target.dataset.index);
    if (rating === this.state.rating) {
      this.setState({ rating: 0 });
    } else {
      this.setState({ rating });
    }
  };

  render() {
    const { quantity, inCart, inWishlist, rating } = this.state;

    return (
      <main>
        {/* Header */}
        <header className="section bg-beige">
          <Container>
            <Row>
              <Col xs={12} md={4} className="mb-3 mb-md-0">
                <img
                  src="https://images.gr-assets.com/books/1406512317l/5326.jpg"
                  alt="A Christmas Carol"
                  className="d-block mx-auto mr-md-0 book-highlight"
                />
              </Col>
              <Col xs={12} md={8} className="text-center text-md-left">
                <h1 className="h1 font-display font-weight-bold">
                  A Christmas Carol
                </h1>
                <p>
                  <span className="text-secondary">by: </span>
                  <Link to="/">Charles Dickens</Link>
                </p>
                <p className="text-description">
                  To bitter, miserly Ebenezer Scrooge, Christmas is just another
                  day. But all that changes when the ghost of his long-dead
                  business partner appears, warning Scrooge to change his ways
                  before it's too late.
                </p>
                <p>
                  <span className="text-secondary">Categories: </span>
                  <Link to="/category/1">Philosophy</Link>,{' '}
                  <Link to="/category/1">Adventure</Link>
                </p>
                <p className="font-weight-bold h2 mb-4">£19.99</p>
                {/* Add To Cart */}
                <Form action="/" method="POST" onSubmit={this.toggleCart}>
                  <div className="d-inline-block mr-3">
                    {/* Quantity */}
                    <Form.Group controlId="quantity" className="mb-3">
                      <Form.Label className="text-description mb-0 d-inline-block mb-2">
                        Quantity:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="rounded-pill bg-transparent w-auto"
                        value={quantity}
                        min="1"
                        onChange={this.changeQuantity}
                        size="sm"
                      />
                    </Form.Group>
                  </div>
                  <div className="d-inline-block">
                    {/* Button */}
                    <Button
                      variant="warning"
                      type="submit"
                      className="rounded-pill"
                    >
                      <i className="material-icons align-top mr-1">
                        {inCart ? 'remove_shopping_cart' : 'add_shopping_cart'}
                      </i>
                      {inCart ? 'Remove From Cart' : 'Add To Cart'}
                    </Button>
                  </div>
                </Form>
                {/* Add To Wishlist */}
                <Form
                  action="/"
                  method="POST"
                  onSubmit={this.toggleWishlist}
                  className="mb-3"
                >
                  <Button
                    variant="link"
                    type="submit"
                    className="link-secondary pl-0"
                  >
                    <i className="material-icons text-danger align-top mr-1">
                      {inWishlist ? 'favorite' : 'favorite_border'}
                    </i>
                    {inWishlist ? 'Remove From Wishlist' : 'Add To Wishlist'}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </header>
        {/* About */}
        <article className="section">
          <Container>
            <Row>
              {/* Menu */}
              <Col xs={12} md={4} className="d-none d-md-block text-right">
                <div className="sticky-top mb-3">
                  <h2 className="heading heading--right-md mb-4">
                    <span>About This Book</span>
                  </h2>
                  <Scrollspy
                    items={['overview', 'details', 'quotes']}
                    currentClassName="active font-weight-bold"
                    className="list-unstyled text-uppercase font-weight-light scrollspy"
                  >
                    <li className="mb-2">
                      <a href="#overview" className="scrollspy__link">
                        Overview
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#details" className="scrollspy__link">
                        Details
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#quotes" className="scrollspy__link">
                        Quotes
                      </a>
                    </li>
                  </Scrollspy>
                </div>
              </Col>
              {/* Book details */}
              <Col xs={12} md={8} className="font-serif font-size-7">
                <section id="overview" className="mb-4">
                  <h3 className="text-uppercase font-size-6">Overview</h3>
                  <p>
                    'If I had my way, every idiot who goes around with Merry
                    Christmas on his lips, would be boiled with his own pudding,
                    and buried with a stake of holly through his heart. Merry
                    Christmas? Bah humbug!'
                    <br />
                    <br />
                    Introduction and Afterword by Joe Wheeler
                    <br />
                    To bitter, miserly Ebenezer Scrooge, Christmas is just
                    another day. But all that changes when the ghost of his
                    long-dead business partner appears, warning Scrooge to
                    change his ways before it's too late. <br />
                    <br />
                    Part of the Focus on the Family Great Stories collection,
                    this edition features an in-depth introduction and
                    discussion questions by Joe Wheeler to provide greater
                    understanding for today's reader. "A Christmas Carol"
                    captures the heart of the holidays like no other novel.
                  </p>
                </section>
                <section id="details" className="mb-4">
                  <h3 className="text-uppercase font-size-6">Details</h3>
                  <ul className="list-unstyled">
                    <li>
                      <span className="font-weight-bold">Publisher:</span> AKW
                      Books
                    </li>
                    <li>
                      <span className="font-weight-bold">Publish Date:</span>{' '}
                      1990
                    </li>
                    <li>
                      <span className="font-weight-bold">Page Count:</span> 4000
                    </li>
                  </ul>
                </section>
                <section id="quotes" className="mb-4">
                  <h3 className="text-uppercase font-size-6">Quotes</h3>
                  <ul className="list-unstyled mb-3">
                    {new Array(5).fill(0).map((item, index) => (
                      <li key={index} className="quote mb-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Alias modi cupiditate, maiores mollitia reprehenderit,
                        eaque assumenda necessitatibus optio aut sequi
                        laudantium autem quam id labore quisquam similique
                        voluptates non officiis nisi adipisci inventore
                        repellendus. Aliquid dolore magnam corrupti quisquam
                        explicabo, quo et fugit perspiciatis ut, architecto sed
                        quasi ad vel libero, odit aspernatur in impedit beatae
                        atque suscipit voluptatum? Minus.
                      </li>
                    ))}
                  </ul>
                  <p className="font-weight-bold">
                    <Link to="/">Read More...</Link>
                  </p>
                </section>
              </Col>
            </Row>
          </Container>
        </article>
        {/* Author */}
        <article className="section bg-beige text-center">
          <Container>
            <Row>
              <Col xs={12} md={8} className="offset-md-4 text-md-left">
                <h2 className="heading heading--left-md mb-4">
                  <span>About The Author</span>
                </h2>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} className="text-md-right mb-4 mb-md-0">
                <img
                  src="https://images.gr-assets.com/authors/1387078070p5/239579.jpg"
                  alt="Charles Dickens"
                />
              </Col>
              <Col xs={12} md={8} className="text-md-left">
                <div className="mb-3">
                  <b>Charles John Huffam Dickens</b> was a writer and social
                  critic who created some of the world's best-known fictional
                  characters and is regarded as the greatest novelist of the
                  Victorian era. His works enjoyed unprecedented popularity
                  during his lifetime, and by the twentieth century critics and
                  scholars had recognised him as a literary genius. His novels
                  and short stories enjoy lasting popularity.
                  <br />
                  <br />
                  Dickens left school to work in a factory when his father was
                  incarcerated in a debtors' prison. Despite his lack of formal
                  education, he edited a weekly journal for 20 years, wrote 15
                  novels, five novellas, hundreds of short stories and
                  non-fiction articles, lectured and performed extensively, was
                  an indefatigable letter writer, and campaigned vigorously for
                  children's rights, education, and other social reforms...
                </div>
                <p className="font-weight-bold">
                  <Link to="/">Read More...</Link>
                </p>
              </Col>
            </Row>
          </Container>
        </article>
        {/* Other books by author */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-4">
              <span>Other Books by</span> <Link to="/">Charles Dickens</Link>
            </h2>
            <Slider {...slickOptions} className="text-center">
              {new Array(15).fill(0).map((item, index) => (
                <ProductCard
                  key={index}
                  image="https://images.gr-assets.com/books/1344922523m/1953.jpg"
                  title="A Tale of Two Cities"
                  author="Charles Dickens"
                  price={14.99}
                />
              ))}
            </Slider>
          </Container>
        </article>
        {/* Similar books */}
        <article className="section text-center bg-beige">
          <Container>
            <h2 className="heading mb-4">
              <span>Readers also enjoyed</span>
            </h2>
            <Slider {...slickOptions} className="text-center">
              {new Array(15).fill(0).map((item, index) => (
                <ProductCard
                  key={index}
                  image="https://images.gr-assets.com/books/1483412266m/865.jpg"
                  title="The Alchemist"
                  author="Paulo Coelho"
                  price={14.99}
                />
              ))}
            </Slider>
          </Container>
        </article>
        {/* Reviews */}
        <article id="reviews" className="section">
          <Container>
            <h3 className="text-uppercase mb-3 h6">Reviews</h3>
            <section className="mb-5">
              <p>
                Your rating:{' '}
                <Stars rating={rating} editable onClick={this.handleRating} />
              </p>
              <Form>
                <Form.Group controlId="review">
                  <Form.Label srOnly>Your review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="Write a review for this book..."
                    className="placeholder-inherit"
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  type="submit"
                  className="rounded-pill"
                >
                  Submit Review
                </Button>
              </Form>
            </section>
            <section>
              <Media>
                <img
                  src="https://via.placeholder.com/150/92c952"
                  alt="Jordan Walker profile picture"
                  width="70"
                  height="70"
                  className="mr-3"
                />
                <Media.Body>
                  <div className="d-md-flex">
                    <p className="mb-2 mr-auto">
                      <span className="h6 mr-2 d-block d-md-inline-block">
                        Jordan Walker
                      </span>
                      <span className="mr-2">rated it</span>
                      <Stars rating={3} />
                    </p>
                    <p className="text-secondary">Dec 19 2018</p>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iusto eum tempore ipsa! Eum eos libero eaque, explicabo
                    aliquam, possimus voluptas consequatur dolore ullam
                    assumenda fugiat quibusdam ad molestias excepturi officia,
                    autem tempore dolores delectus quo voluptatum animi maiores.
                    Quaerat cum libero, at animi perspiciatis, eos quisquam,
                    porro unde nobis magnam nesciunt. Veniam voluptatem repellat
                    inventore vel consequuntur vero possimus aliquam!
                  </p>
                </Media.Body>
              </Media>
            </section>
          </Container>
        </article>
      </main>
    );
  }
}

export default Show;
