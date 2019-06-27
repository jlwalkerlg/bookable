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
import BookCarousel from '../../components/BookCarousel';
import { addToShelf, removeFromShelf } from '../../actions/shelves';
import Truncate from '../../components/Truncate';
import Async from '../../components/Async';

class Show extends Component {
  state = {
    loading: {
      book: true,
      quotes: true,
      shelves: true,
      shelfItems: true
    },
    errors: {
      book: null,
      quotes: null,
      shelves: null,
      shelfItems: null
    },
    book: null,
    quotes: null,
    shelves: null,
    shelfItems: null,
    quantity: 1
  };

  componentDidMount() {
    this.fetchBook();
    this.fetchQuotes();
    this.fetchShelves();
    this.fetchShelfItems();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchBook();
      this.fetchQuotes();
      this.fetchShelves();
      this.fetchShelfItems();
    }
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

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
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

  render() {
    const { loading, errors, book, quotes, shelves, quantity } = this.state;
    const { user } = this.props;

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
