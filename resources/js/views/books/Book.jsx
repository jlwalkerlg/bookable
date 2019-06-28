import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Scrollspy from 'react-scrollspy';
import axios from 'axios';
import sanitize from '../../utils/sanitize';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlist';
import { addToCart, removeFromCart } from '../../actions/cart';
import { addRating, updateRating, deleteRating } from '../../actions/ratings';
import BookCarousel from '../../components/BookCarousel';
import { addToShelf, removeFromShelf } from '../../actions/shelves';
import Truncate from '../../components/Truncate';
import Async from '../../components/Async';
import BookReviews from '../../components/BookReviews';
import BookUserReview from '../../components/BookUserReview';
import { addReview } from '../../actions/reviews';
import Stars from '../../components/Stars';

class Show extends Component {
  state = {
    loading: {
      book: true,
      quotes: true,
      shelves: true,
      shelfItems: true,
      reviews: true,
      userRating: true,
      userReview: true
    },
    errors: {
      book: null,
      quotes: null,
      shelves: null,
      shelfItems: null,
      reviews: null,
      userRating: null,
      userReview: null
    },
    processing: {
      userRating: false
    },
    book: null,
    quotes: null,
    shelves: null,
    shelfItems: null,
    reviews: null,
    userRating: null,
    userReview: null,
    quantity: 1
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData();
    }
  }

  fetchData() {
    this.fetchBook();
    this.fetchQuotes();
    this.fetchShelves();
    this.fetchShelfItems();
    this.fetchReviews();
    this.fetchUserRating();
    this.fetchUserReview();
  }

  fetchBook = async () => {
    this.setLoading({ book: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get(`/api/books/${bookId}`, {
        params: { with: 'author.books,categories' }
      });
      const book = response.data;
      this.setState({ book });
      this.setError({ book: null });
    } catch (error) {
      this.setError({ book: error.response.statusText });
    }
    this.setLoading({ book: false });
  };

  fetchQuotes = async () => {
    this.setLoading({ quotes: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/quotes', {
        params: { book_id: bookId, limit: 5 }
      });
      const { quotes } = response.data;
      this.setState({ quotes });
      this.setError({ quotes: null });
    } catch (error) {
      this.setError({ quotes: error.response.statusText });
    }
    this.setLoading({ quotes: false });
  };

  fetchShelves = async () => {
    const { user } = this.props;
    if (!user.id) return;

    this.setLoading({ shelves: true });
    try {
      const response = await axios.get('/api/shelves', {
        params: { user_id: user.id }
      });
      const { shelves } = response.data;
      this.setState({ shelves });
      this.setError({ shelves: null });
    } catch (error) {
      this.setError({ shelves: error.response.statusText });
    }
    this.setLoading({ shelves: false });
  };

  fetchShelfItems = async () => {
    const { user } = this.props;
    if (!user.id) return;

    this.setLoading({ shelfItems: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/shelves/items', {
        params: { book_id: bookId, user_id: user.id }
      });
      const { items } = response.data;
      this.setState({ shelfItems: items });
      this.setError({ shelfItems: null });
    } catch (error) {
      this.setError({ shelfItems: error.response.statusText });
    }
    this.setLoading({ shelfItems: false });
  };

  fetchReviews = async () => {
    this.setLoading({ reviews: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/reviews', {
        params: { book_id: bookId, with: 'user' }
      });
      const { reviews } = response.data;
      const userIds = reviews.map(review => review.user_id);
      const ratings = await this.fetchRatings(userIds);
      this.setState({
        reviews: reviews.map(review => ({
          ...review,
          rating: ratings.filter(rating => rating.user_id === review.user_id)[0]
        }))
      });
      this.setError({ reviews: null });
    } catch (error) {
      this.setError({ reviews: error.response.statusText });
    }
    this.setLoading({ reviews: false });
  };

  fetchRatings = async userIds => {
    const bookId = this.props.match.params.id;
    const response = await axios.get('/api/ratings', {
      params: { book_id: bookId, user_ids: userIds.join(',') }
    });
    return response.data.ratings;
  };

  fetchUserRating = async () => {
    const { user } = this.props;
    if (!user.id) return null;

    this.setLoading({ userRating: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/ratings', {
        params: { book_id: bookId, user_id: user.id }
      });
      const userRating = response.data.ratings[0];
      this.setState({ userRating });
      this.setError({ userRating: null });
    } catch (error) {
      this.setError({ userRating: error.response.statusText });
    }
    this.setLoading({ userRating: false });
  };

  fetchUserReview = async () => {
    const { user } = this.props;
    if (!user.id) return null;

    this.setLoading({ userReview: true });
    const bookId = this.props.match.params.id;
    try {
      const response = await axios.get('/api/reviews', {
        params: { book_id: bookId, user_id: user.id }
      });
      const userReview = response.data.reviews[0];
      this.setState({ userReview });
      this.setError({ userReview: null });
    } catch (error) {
      this.setError({ userReview: error.response.statusText });
    }
    this.setLoading({ userReview: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  setProcessing(processing) {
    this.setState({ processing: { ...this.state.processing, ...processing } });
  }

  changeQuantity = e => {
    const quantity = parseInt(e.target.value);
    this.setState({ quantity });
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

  removeFromWishlist(e, book) {
    e.preventDefault();
    this.props.removeFromWishlist(book);
  }

  removeFromCart(e, book) {
    e.preventDefault();
    this.props.removeFromCart(book);
  }

  inWishlist(bookId) {
    const { wishlist } = this.props;
    const { items } = wishlist;
    return items && !!items.filter(item => item.book_id === bookId).length;
  }

  inCart(bookId) {
    const { items } = this.props.cart;
    return items && !!items.filter(item => item.book_id === bookId).length;
  }

  getShelfItem = shelf => {
    const { shelfItems } = this.state;
    return shelfItems.filter(item => item.shelf_id === shelf.id)[0];
  };

  addToShelf = async (e, shelf) => {
    e.preventDefault();
    const { book } = this.state;
    const shelfItem = await addToShelf(book, shelf);
    const shelfItems = [...this.state.shelfItems, shelfItem];
    this.setState({ shelfItems });
  };

  removeFromShelf = async (e, shelfItem) => {
    e.preventDefault();
    await removeFromShelf(shelfItem);
    const shelfItems = this.state.shelfItems.filter(
      item => item.id !== shelfItem.id
    );
    this.setState({ shelfItems });
  };

  addRating = async (e, book) => {
    e.preventDefault();

    const { processing } = this.state;
    if (processing.userRating) return;

    this.setProcessing({ userRating: true });

    const rating = 5 - parseInt(e.target.dataset.index);
    const { user } = this.props;
    const userRating = await addRating(rating, book, user);
    this.setState({ userRating });

    this.setProcessing({ userRating: false });
  };

  updateRating = async (rating, newRating) => {
    await updateRating(rating, newRating);
    const userRating = { ...this.state.userRating, rating: newRating };
    this.setState({ userRating });
  };

  deleteRating = async rating => {
    await deleteRating(rating);
    this.setState({ userRating: null });
  };

  handleUpdateRating = async (e, rating) => {
    e.preventDefault();

    const { processing } = this.state;
    if (processing.userRating) return;

    this.setProcessing({ userRating: true });

    const newRating = 5 - parseInt(e.target.dataset.index);
    newRating === rating.rating
      ? await this.deleteRating(rating)
      : await this.updateRating(rating, newRating);

    this.setProcessing({ userRating: false });
  };

  render() {
    const {
      loading,
      errors,
      processing,
      book,
      quotes,
      shelves,
      reviews,
      userRating,
      quantity
    } = this.state;
    const { user } = this.props;

    const userReview = this.state.userReview
      ? { ...this.state.userReview, rating: userRating }
      : null;

    return (
      <Async loading={loading.book} error={errors.book} retry={this.fetchBook}>
        {() => {
          const { author } = book;
          const moreAuthorBooks = author.books.filter(
            item => item.id !== book.id
          );
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
                        src={book.large_image_url || book.image_url}
                        alt={book.title}
                        className="d-block mx-auto mr-md-0 book-highlight"
                      />
                      {user.id && (
                        <Async
                          loading={loading.userRating}
                          error={errors.userRating}
                          retry={this.fetchUserRating}
                        >
                          {() => (
                            <div className="text-center mt-3">
                              <p>
                                Your rating:
                                <Stars
                                  className={`ml-2${
                                    processing.userRating ? ' disabled' : ''
                                  }`}
                                  editable={!processing.userRating}
                                  onClick={
                                    userRating
                                      ? e =>
                                          this.handleUpdateRating(e, userRating)
                                      : e => this.addRating(e, book)
                                  }
                                  rating={
                                    (userRating && userRating.rating) || 0
                                  }
                                />
                              </p>
                            </div>
                          )}
                        </Async>
                      )}
                    </Col>
                    <Col xs={12} md={8} className="text-center text-md-left">
                      <h1 className="h1 font-display font-weight-bold">
                        {book.title}
                      </h1>
                      <p>
                        <span className="text-secondary">by: </span>
                        <Link to={`/authors/${author.id}`}>{author.name}</Link>
                      </p>
                      <Truncate
                        html={book.description}
                        length={1000}
                        btnClassName="font-size-7"
                        className="text-description"
                      />
                      <p>
                        <span className="text-secondary">Categories: </span>
                        {book.categories.length ? (
                          book.categories.map((category, index) => (
                            <React.Fragment key={index}>
                              {index !== 0 && ', '}
                              <Link to={`/category/${category.id}`}>
                                {category.name}
                              </Link>
                            </React.Fragment>
                          ))
                        ) : (
                          <p className="font-size-7 text-secondary">
                            No categories to show.
                          </p>
                        )}
                      </p>
                      <p className="font-weight-bold h2 mb-4">£{book.price}</p>
                      {user.id && (
                        <>
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
                                  {inCart
                                    ? 'remove_shopping_cart'
                                    : 'add_shopping_cart'}
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
                                ? e => this.removeFromWishlist(e, book)
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
                              {inWishlist
                                ? 'Remove From Wishlist'
                                : 'Add To Wishlist'}
                            </Button>
                          </Form>
                          {/* Add To Shelf */}
                          <Async
                            loading={loading.shelves || loading.shelfItems}
                            error={errors.shelves || errors.shelfItems}
                            retry={
                              errors.shelves
                                ? this.fetchShelves
                                : this.fetchShelfItems
                            }
                          >
                            {() => (
                              <Dropdown>
                                <Dropdown.Toggle variant="info" id="addToShelf">
                                  Add To Shelf
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  {shelves.map((shelf, index) => {
                                    const shelfItem = this.getShelfItem(shelf);

                                    return (
                                      <Form
                                        key={index}
                                        action={`/api/shelves/${
                                          shelf.id
                                        }/items`}
                                        method="POST"
                                        onSubmit={
                                          shelfItem
                                            ? e =>
                                                this.removeFromShelf(
                                                  e,
                                                  shelfItem
                                                )
                                            : e => this.addToShelf(e, shelf)
                                        }
                                      >
                                        <Dropdown.Item
                                          as="button"
                                          className="d-flex justify-content-between align-items-center"
                                        >
                                          {shelf.name}
                                          <i className="material-icons">
                                            {shelfItem
                                              ? 'check_box'
                                              : 'check_box_outline_blank'}
                                          </i>
                                        </Dropdown.Item>
                                      </Form>
                                    );
                                  })}
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </Async>
                        </>
                      )}
                    </Col>
                  </Row>
                </Container>
              </header>
              {/* About */}
              <article className="section">
                <Container>
                  <Row>
                    {/* Menu */}
                    <Col
                      xs={12}
                      md={4}
                      className="d-none d-md-block text-right"
                    >
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
                          dangerouslySetInnerHTML={sanitize.markup(
                            book.description
                          )}
                        />
                      </section>
                      <section id="details" className="mb-4">
                        <h3 className="text-uppercase font-size-6">Details</h3>
                        <ul className="list-unstyled">
                          <li>
                            <span className="font-weight-bold">Publisher:</span>{' '}
                            {book.publisher}
                          </li>
                          <li>
                            <span className="font-weight-bold">
                              Publish Date:
                            </span>{' '}
                            {book.publication_date}
                          </li>
                          <li>
                            <span className="font-weight-bold">
                              Page Count:
                            </span>{' '}
                            {book.num_pages}
                          </li>
                        </ul>
                      </section>
                      <section id="quotes" className="mb-4">
                        <h3 className="text-uppercase font-size-6">Quotes</h3>
                        <Async
                          loading={loading.quotes}
                          error={errors.quotes}
                          retry={this.fetchQuotes}
                        >
                          {() => (
                            <ul className="list-unstyled mb-3">
                              {quotes.map((quote, index) => (
                                <li
                                  key={index}
                                  className="quote mb-3"
                                  dangerouslySetInnerHTML={sanitize.markup(
                                    quote.quote
                                  )}
                                />
                              ))}
                            </ul>
                          )}
                        </Async>
                        <p className="font-weight-bold">
                          <Link to={`/books/${book.id}/quotes`}>
                            More Quotes...
                          </Link>
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
                      <Truncate html={author.about} length={1000} />
                      <p className="font-weight-bold mt-3">
                        <Link to={`/authors/${author.id}`}>View Author</Link>
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
                  {moreAuthorBooks.length ? (
                    <BookCarousel books={moreAuthorBooks} />
                  ) : (
                    'No books to show.'
                  )}
                </Container>
              </article>
              {/* Similar books */}
              <article className="section text-center bg-beige">
                <Container>
                  <h2 className="heading mb-4">
                    <span>Readers also enjoyed</span>
                  </h2>
                  <BookCarousel
                    books={new Array(15).fill(0).map(() => ({
                      id: 1,
                      image_url:
                        'https://images.gr-assets.com/books/1483412266m/865.jpg',
                      title: 'The Alchemist',
                      author: { id: 1, name: 'Paulo Coelho' },
                      price: 14.99,
                      author_id: 1
                    }))}
                  />
                </Container>
              </article>
              <article id="reviews" className="section">
                <Container>
                  <h3 className="text-uppercase mb-3 h6">Reviews</h3>
                  {user.id && (
                    <Async
                      loading={loading.userReview}
                      error={errors.userReview}
                      retry={this.fetchUserReview}
                    >
                      {() =>
                        userReview ? (
                          <BookUserReview review={userReview} user={user} />
                        ) : (
                          <Link
                            to={`/books/${book.id}/reviews/new`}
                            className="default"
                          >
                            Write a review.
                          </Link>
                        )
                      }
                    </Async>
                  )}
                  <Async
                    loading={loading.reviews}
                    error={errors.reviews}
                    retry={this.fetchReviews}
                  >
                    {() => (
                      <BookReviews
                        className="mt-3"
                        reviews={reviews.filter(
                          review => review.user_id !== user.id
                        )}
                        user={user}
                      />
                    )}
                  </Async>
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
  user: PropTypes.object.isRequired,
  wishlist: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user, wishlist, cart }) => ({
  user,
  wishlist,
  cart
});

const mapDispatchToProps = {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
