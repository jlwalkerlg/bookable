import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import URL from '../utils/URL';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ShelfItemsTable from '../components/ShelfItemsTable';
import BookListing from '../components/BookListing';

class Shelves extends Component {
  state = {
    loading: true,
    user: {},
    shelves: [],
    shelfItems: [],
    ratings: [],
    userRatings: [],
    count: 0,
    limit: 10
  };

  async componentDidMount() {
    await this.fetchData();
    this.setState({ loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.setState({ loading: true });
      await this.fetchData();
      this.setState({ loading: false });
    }
  }

  async fetchData() {
    const [{ user }, { items }] = await axios.all([
      this.fetchShelves(),
      this.fetchShelfItems()
    ]);

    const bookIds = items.map(item => item.book_id);
    const authUser = this.props.user;

    if (authUser.id && user.id !== authUser.id) {
      await axios.all([
        this.fetchRatings(bookIds),
        this.fetchUserRatings(bookIds)
      ]);
    } else {
      await this.fetchRatings(bookIds);
    }
  }

  async fetchShelves() {
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}/shelves`);
      const { user, shelves } = response.data;
      this.setState({ user, shelves });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchShelfItems() {
    const { userId, shelfId } = this.props.match.params;
    const { limit } = this.state;
    const offset = this.calcOffset();
    const params = {
      limit,
      offset,
      with: 'book.author',
      count: true,
      shelf_id: shelfId,
      user_id: userId
    };
    try {
      const response = await axios.get('/api/shelves/items', { params });
      const { items, count } = response.data;
      this.setState({ shelfItems: items, count });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchRatings(bookIds) {
    const { userId } = this.props.match.params;
    const { user } = this.props;
    if (user.id === parseInt(userId)) return null;
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: userId, book_ids: bookIds.join(',') }
      });
      const { ratings } = response.data;
      this.setState({ ratings });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserRatings(bookIds) {
    const { user } = this.props;
    if (!user.id) return null;
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: user.id, book_ids: bookIds.join(',') }
      });
      const { ratings } = response.data;
      this.setState({ userRatings: ratings });
    } catch (error) {
      console.log(error);
    }
  }

  needsUpdate(prevProps) {
    return (
      prevProps.match.params.shelfId !== this.props.match.params.shelfId ||
      prevProps.match.params.userId !== this.props.match.params.userId ||
      prevProps.location.search !== this.props.location.search
    );
  }

  calcOffset() {
    const { limit } = this.state;
    const page = this.getCurrentPage();
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return parseInt(
      URL.query(this.props.location.search).getParam('page') || 1
    );
  }

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

  getRating(book) {
    return this.state.ratings.filter(rating => rating.book_id === book.id)[0];
  }

  getUserRating(book, rating) {
    if (this.state.user.id === this.props.user.id) return rating;

    return this.state.userRatings.filter(
      userRating => userRating.book_id === book.id
    )[0];
  }

  render() {
    const {
      loading,
      user,
      shelves,
      shelfItems,
      ratings,
      userRatings,
      count,
      limit
    } = this.state;

    if (loading)
      return (
        <div className="vh-min-100">
          <Loading />
        </div>
      );

    const authUser = this.props.user;

    return (
      <div className="section">
        <Container>
          <Row>
            <Col xs={12} lg={3}>
              <h2 className="h5 text-uppercase">Bookshelves</h2>
              <ul className="list-unstyled text-secondary d-none d-md-block">
                <li>
                  <NavLink
                    className="sub-nav-link"
                    to={`/users/${user.id}/shelves`}
                    exact
                  >
                    All
                  </NavLink>
                </li>
                {shelves.map((shelf, index) => (
                  <li key={index}>
                    <NavLink
                      className="sub-nav-link"
                      to={`/users/${user.id}/shelves/${shelf.id}`}
                      exact
                    >
                      {shelf.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Dropdown className="d-block d-md-none w-100">
                <Dropdown.Toggle variant="info" id="addToShelf">
                  Select a shelf
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={NavLink}
                    to={`/users/${user.id}/shelves`}
                    exact
                    className="d-flex justify-content-between align-items-center"
                  >
                    All
                  </Dropdown.Item>
                  {shelves.map((shelf, index) => (
                    <Dropdown.Item
                      key={index}
                      as={NavLink}
                      to={`/users/${user.id}/shelves/${shelf.id}`}
                      exact
                      className="d-flex justify-content-between align-items-center"
                    >
                      {shelf.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={12} lg={9} className="mt-3 mt-md-0">
              <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
              <ShelfItemsTable
                className="d-none d-md-table mt-3"
                user={user}
                authUser={authUser}
                shelfItems={shelfItems}
                ratings={ratings}
                userRatings={userRatings}
                onDeleteItem={this.removeFromShelf}
              />
              {/* <div className="d-md-none mb-3">
                {shelfItems.map((shelfItem, index) => {
                  const { book, userRating, authUserRating } = shelfItem;
                  const { author } = book;

                  return (
                    <Media key={index} className="product-table__row py-3">
                      <img
                        src={book.image_url}
                        alt={book.title}
                        className="mr-3"
                      />
                      <Media.Body>
                        <p className="h5">
                          <Link to={`/books/${book.id}`}>{book.title}</Link>
                        </p>
                        <p>
                          <span className="text-secondary">by: </span>
                          <Link to={`/authors/${author.id}`}>
                            {author.name}
                          </Link>
                        </p>
                        <p className="font-size-7 mb-2">
                          <span className="text-secondary">
                            Average rating:
                          </span>{' '}
                          {book.avg_rating.toFixed(2)}
                        </p>
                        {!isOwnShelf && (
                          <p className="font-size-7 mb-2">
                            <span className="text-secondary">User rating:</span>{' '}
                            <Stars
                              rating={(userRating && userRating.rating) || 0}
                            />
                          </p>
                        )}
                        {authUser.id && (
                          <p className="font-size-7 mb-2">
                            <span className="text-secondary">Your rating:</span>{' '}
                            <Stars
                              rating={
                                (authUserRating && authUserRating.rating) || 0
                              }
                            />
                          </p>
                        )}
                        <p className="font-size-7 mb-2">
                          <span className="text-secondary">Date Added:</span>{' '}
                          {shelfItem.created_at}
                        </p>
                        {isOwnShelf && (
                          <Form
                            action="/"
                            method="POST"
                            onSubmit={e => this.removeFromShelf(e, shelfItem)}
                          >
                            <Button
                              variant="link"
                              type="submit"
                              className="text-danger p-0 font-size-7"
                            >
                              Remove from shelf
                            </Button>
                          </Form>
                        )}
                      </Media.Body>
                    </Media>
                  );
                })}
              </div> */}

              <div className="d-md-none mb-3">
                {shelfItems.map((shelfItem, index) => {
                  const { book } = shelfItem;
                  const rating = this.getRating(book);
                  const userRating = this.getUserRating(book, rating);

                  return (
                    <BookListing
                      key={index}
                      className="product-table__row py-3"
                      user={user}
                      authUser={authUser}
                      book={book}
                      author={book.author}
                      rating={rating}
                      userRating={userRating}
                      createdAt={shelfItem.created_at}
                      deletable={user.id === authUser.id}
                      onDelete={e => this.removeFromShelf(e, shelfItem)}
                    />
                  );
                })}
              </div>
              <Pagination
                totalItems={count}
                currentPage={this.getCurrentPage()}
                pageSize={limit}
                maxPages={5}
                url={`${this.props.location.pathname}?page=`}
                className="justify-content-center pagination-warning"
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Shelves.propTypes = {
  user: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user, shelves }) => ({
  user,
  shelves
});

export default connect(mapStateToProps)(Shelves);
