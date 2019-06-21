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
    shelves: null,
    shelfItems: null,
    quantity: 1
  };

  async componentDidMount() {
    const data = await this.fetchData();
    console.log(data);
    this.setState({ ...data, loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loading: true });
      const data = await this.fetchData();
      this.setState({ ...data, loading: false });
    }
  }

  async fetchData() {
    const { user } = this.props;
    try {
      const [book, shelves, shelfItems] = await axios.all([
        this.fetchBook(),
        user.id && this.fetchShelves(),
        user.id && this.fetchShelfItems()
      ]);
      return { book, shelves, shelfItems };
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBook() {
    const bookId = this.props.match.params.id;
    try {
      const result = await axios.get(`/api/books/${bookId}`, {
        params: { with: 'author.books' }
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchShelves() {
    const { user } = this.props;
    try {
      const response = await axios.get('/api/shelves', {
        params: { user_id: user.id }
      });
      return response.data.shelves;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchShelfItems() {
    const bookId = this.props.match.params.id;
    const { user } = this.props;
    try {
      const response = await axios.get('/api/shelves/items', {
        params: { book_id: bookId, user_id: user.id }
      });
      return response.data.items;
    } catch (error) {
      console.log(error);
    }
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
    try {
      const response = await axios.post(`/api/shelves/${shelf.id}/items`, {
        book_id: book.id
      });
      const shelfItems = [...this.state.shelfItems, response.data];
      this.setState({ shelfItems });
    } catch (error) {
      console.log(error);
    }
  };

  removeFromShelf = async (e, shelfItem) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/shelves/items/${shelfItem.id}`);
      const shelfItems = this.state.shelfItems.filter(
        item => item.id !== shelfItem.id
      );
      this.setState({ shelfItems });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading, book, shelves, quantity } = this.state;
    const { user } = this.props;

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
                              action={`/api/shelves/${shelf.id}/items`}
                              method="POST"
                              onSubmit={
                                shelfItem
                                  ? e => this.removeFromShelf(e, shelfItem)
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
      </main>
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
