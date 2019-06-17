import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Media,
  Dropdown
} from 'react-bootstrap';
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
import { addToShelf, removeFromShelf } from '../../actions/shelves';
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
    review: {
      rating: 0,
      review: ''
    },
    editReview: false
  };

  async componentDidMount() {
    const book = await this.fetchBook();
    const review = this.getUserReview(book) || this.state.review;
    this.setState({ book, review, loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loading: true });
      const book = await this.fetchBook();
      const review = this.getUserReview(book) || { rating: 0, review: '' };
      this.setState({ book, review, loading: false });
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

  getUserReview(book) {
    const { user } = this.props;
    return book.reviews.filter(review => review.user_id === user.id)[0];
  }

  changeQuantity = e => {
    const quantity = parseInt(e.target.value);
    this.setState({ quantity });
  };

  handleRatingChange = e => {
    const rating = 5 - parseInt(e.target.dataset.index);
    if (rating === this.state.rating) {
      this.setState({ review: { ...this.state.review, rating: 0 } });
    } else {
      this.setState({ review: { ...this.state.review, rating } });
    }
  };

  handleReviewChange = e => {
    const review = e.target.value;
    this.setState({ review: { ...this.state.review, review } });
  };

  handleReviewSubmit = async e => {
    e.preventDefault();
    const { review, book } = this.state;
    const params = { ...review, book_id: book.id };
    try {
      const response = review.id
        ? await axios.patch(`/api/reviews/${review.id}`, params)
        : await axios.post(`/api/reviews`, params);
      const newReview = response.data;
      const reviews = [newReview, ...book.reviews];
      const newBook = {
        ...book,
        ratings_count: review.id ? book.ratings_count : book.ratings_count + 1,
        ratings_sum: book.rating_sum - review.rating + newReview.rating,
        reviews
      };
      this.setState({
        book: newBook,
        review: newReview,
        editReview: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  addToWishlist(e, book) {
    e.preventDefault();
    this.props.addToWishlist(book);
  }

  addToCart(e, book) {
    e.preventDefault();
    const { quantity } = this.state;
    this.props.addToCart(book, quantity);
  }

  removeFromWishlist(e, bookId) {
    e.preventDefault();
    this.props.removeFromWishlist(bookId);
  }

  removeFromCart(e, book) {
    e.preventDefault();
    this.props.removeFromCart(book);
  }

  inWishlist(bookId) {
    const { wishlist } = this.props;
    return !!wishlist.filter(item => item.book_id === bookId).length;
  }

  inCart(bookId) {
    const { cart_items } = this.props.cart;
    return (
      cart_items && !!cart_items.filter(item => item.book_id === bookId).length
    );
  }

  getItemFromShelf(shelfId, bookId) {
    const shelf = this.props.shelves.filter(shelf => shelf.id === shelfId)[0];
    return shelf.shelf_items.filter(item => item.book_id === bookId)[0];
  }

  addToShelf(e, shelf, book) {
    e.preventDefault();
    this.props.addToShelf(shelf, book);
  }

  removeFromShelf(e, shelf, item) {
    e.preventDefault();
    this.props.removeFromShelf(shelf, item);
  }

  toggleEditReview = () =>
    this.setState({ editReview: !this.state.editReview });

  render() {
    const { loading, book, quantity, review, editReview } = this.state;
    const { user, shelves } = this.props;

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
                  className="mb-3"
                  onSubmit={
                    inCart
                      ? e => this.removeFromCart(e, book)
                      : e => this.addToCart(e, book)
                  }
                >
                  {/* Quantity */}
                  {!inCart && (
                    <div className="d-inline-block mr-3">
                      <Form.Group controlId="quantity">
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
                  )}
                  {/* Submit button */}
                  <div className="d-inline-block">
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
                {/* Add To Shelf */}
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="addToShelf">
                    Add To Shelf
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {shelves.map((shelf, index) => {
                      const item = this.getItemFromShelf(shelf.id, book.id);

                      return (
                        <Form
                          key={index}
                          action={`/api/shelves/${shelf.id}/shelf-items`}
                          method="POST"
                          onSubmit={
                            item
                              ? e => this.removeFromShelf(e, shelf, item)
                              : e => this.addToShelf(e, shelf, book)
                          }
                        >
                          <Dropdown.Item
                            as="button"
                            className="d-flex justify-content-between align-items-center"
                          >
                            {shelf.name}
                            <i className="material-icons">
                              {item ? 'check_box' : 'check_box_outline_blank'}
                            </i>
                          </Dropdown.Item>
                        </Form>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
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
              {(!review.id || editReview) && (
                <Form onSubmit={this.handleReviewSubmit}>
                  <Form.Group>
                    <Form.Label>Your rating:</Form.Label>{' '}
                    <Stars
                      rating={review.rating}
                      editable
                      onClick={this.handleRatingChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="review">
                    <Form.Label srOnly>Your review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder="Write a review for this book..."
                      value={review.review}
                      onChange={this.handleReviewChange}
                      className="placeholder-inherit"
                    />
                  </Form.Group>
                  <Button
                    variant={review.id ? 'info' : 'warning'}
                    type="submit"
                    className="rounded-pill d-inline-block"
                  >
                    {review.id ? 'Edit Review' : 'Submit Review'}
                  </Button>
                  {editReview && (
                    <Button
                      variant="link"
                      className="ml-3 d-inline-block"
                      onClick={this.toggleEditReview}
                    >
                      Cancel
                    </Button>
                  )}
                </Form>
              )}
              {review.id && !editReview && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="text-secondary">Your review:</p>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={this.toggleEditReview}
                    >
                      Edit Review
                    </Button>
                  </div>
                  <Media>
                    <img
                      src="https://via.placeholder.com/150/92c952"
                      alt={`${user.name} profile picture`}
                      width="70"
                      height="70"
                      className="mr-3"
                    />
                    <Media.Body>
                      <div className="d-md-flex">
                        <p className="mb-2 mr-auto">
                          <span className="h6 mr-2 d-block d-md-inline-block">
                            {user.name}
                          </span>
                          <span className="mr-2">rated it</span>
                          <Stars rating={review.rating || 0} />
                        </p>
                        <p className="text-secondary">{review.created_at}</p>
                      </div>
                      <p>{review.review}</p>
                    </Media.Body>
                  </Media>
                  <hr />
                </div>
              )}
            </section>
            <section>
              {book.reviews
                .filter(review => review.user_id !== user.id)
                .map((review, index) => (
                  <Media key={index}>
                    <img
                      src="https://via.placeholder.com/150/92c952"
                      alt={`${review.user.name} profile picture`}
                      width="70"
                      height="70"
                      className="mr-3"
                    />
                    <Media.Body>
                      <div className="d-md-flex">
                        <p className="mb-2 mr-auto">
                          <span className="h6 mr-2 d-block d-md-inline-block">
                            {review.user.name}
                          </span>
                          <span className="mr-2">rated it</span>
                          <Stars rating={review.rating || 0} />
                        </p>
                        <p className="text-secondary">{review.created_at}</p>
                      </div>
                      <p>{review.review}</p>
                    </Media.Body>
                  </Media>
                ))}
            </section>
          </Container>
        </article>
      </main>
    );
  }
}

Show.propTypes = {
  user: PropTypes.object.isRequired,
  wishlist: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
  shelves: PropTypes.array.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  addToShelf: PropTypes.func.isRequired,
  removeFromShelf: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user, wishlist, cart, shelves }) => ({
  user,
  wishlist,
  cart,
  shelves
});

const mapDispatchToProps = {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  addToShelf,
  removeFromShelf
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
