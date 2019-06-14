import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, Button, Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Scrollspy from 'react-scrollspy';
import Slider from 'react-slick';
import axios from 'axios';
import sanitize from '../../utils/sanitize';
import Stars from '../../components/Stars';
import TempProductCard from '../../components/TempProductCard';
import SlickArrow from '../../components/SlickArrow';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlist';
import { addToCart, removeFromCart } from '../../actions/cart';
import Loading from '../../components/Loading';
import ProductCard from '../../components/ProductCard';

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
    loading: true,
    book: null,
    quantity: 1,
    rating: 0
  };

  async componentDidMount() {
    const book = await this.fetchBook();
    this.setState({ book, loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loading: true });
      const book = await this.fetchBook();
      this.setState({ book, loading: false });
    }
  }

  async fetchBook() {
    const bookId = this.props.match.params.id;
    try {
      const result = await axios.get(`/api/books/${bookId}`);
      const book = result.data;
      return book;
    } catch (err) {
      console.log(err);
    }
  }

  changeQuantity = e => {
    const quantity = parseInt(e.target.value);
    this.setState({ quantity });
  };

  handleRating = e => {
    const rating = 5 - parseInt(e.target.dataset.index);
    if (rating === this.state.rating) {
      this.setState({ rating: 0 });
    } else {
      this.setState({ rating });
    }
  };

  addToWishlist(e, book) {
    e.preventDefault();
    this.props.addToWishlist(book);
  }

  addToCart(e, book) {
    e.preventDefault();
    const { quantity } = this.state;
    this.props.addToCart({ ...book, quantity });
  }

  removeFromWishlist(e, id) {
    e.preventDefault();
    this.props.removeFromWishlist(id);
  }

  removeFromCart(e, id) {
    e.preventDefault();
    this.props.removeFromCart(id);
  }

  inWishlist(id) {
    const { wishlist } = this.props;
    return !!wishlist.filter(book => book.id === id).length;
  }

  inCart(id) {
    const { cart } = this.props;
    return !!cart.filter(book => book.id === id).length;
  }

  render() {
    const { loading, book, quantity, rating } = this.state;

    if (loading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    const { author } = book;

    const inWishlist = this.inWishlist(book.id);
    const inCart = this.inCart(book.id);

    return (
      <main>
        {/* Header */}
        <header className="section bg-beige">
          <Container>
            <Row>
              <Col xs={12} md={4} className="mb-3 mb-md-0">
                <img
                  src={book.large_image_url}
                  alt={book.title}
                  className="d-block mx-auto mr-md-0 book-highlight"
                />
              </Col>
              <Col xs={12} md={8} className="text-center text-md-left">
                <h1 className="h1 font-display font-weight-bold">
                  {book.title}
                </h1>
                <p>
                  <span className="text-secondary">by: </span>
                  <Link to={`/authors/${author.id}`}>{author.name}</Link>
                </p>
                <p
                  className="text-description"
                  dangerouslySetInnerHTML={sanitize.markup(book.description)}
                />
                <p>
                  <span className="text-secondary">Categories: </span>
                  <Link to="/category/1">Philosophy</Link>,{' '}
                  <Link to="/category/1">Adventure</Link>
                </p>
                <p className="font-weight-bold h2 mb-4">£{book.price}</p>
                {/* Add To Cart */}
                <Form
                  action="/"
                  method="POST"
                  onSubmit={
                    inCart
                      ? e => this.removeFromCart(e, book.id)
                      : e => this.addToCart(e, book)
                  }
                >
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
                  onSubmit={
                    inWishlist
                      ? e => this.removeFromWishlist(e, book.id)
                      : e => this.addToWishlist(e, book)
                  }
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
                  <p
                    dangerouslySetInnerHTML={sanitize.markup(book.description)}
                  />
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
                      {book.publication_date}
                    </li>
                    <li>
                      <span className="font-weight-bold">Page Count:</span>{' '}
                      {book.num_pages}
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
                <img src={author.image_url} alt={author.name} />
              </Col>
              <Col xs={12} md={8} className="text-md-left">
                <div
                  className="mb-3"
                  dangerouslySetInnerHTML={sanitize.markup(author.about)}
                />
                <p className="font-weight-bold">
                  <Link to={`/authors/${author.id}`}>Read More...</Link>
                </p>
              </Col>
            </Row>
          </Container>
        </article>
        {/* Other books by author */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-4">
              <span>Other Books by</span>{' '}
              <Link to={`/authors/${author.id}`}>{author.name}</Link>
            </h2>
            <Slider {...slickOptions} className="text-center">
              {author.books
                .filter(item => item.id !== book.id)
                .map((item, index) => (
                  <ProductCard key={index} book={item} />
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
                <TempProductCard
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

Show.propTypes = {
  wishlist: PropTypes.array.isRequired,
  cart: PropTypes.array.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ wishlist, cart }) => ({
  wishlist,
  cart
});

const mapDispatchToProps = {
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
