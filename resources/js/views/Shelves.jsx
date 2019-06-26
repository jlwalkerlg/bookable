import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import URL from '../utils/URL';
import Pagination from '../components/Pagination';
import Async from '../components/Async';
import ShelfItemsTable from '../components/ShelfItemsTable';
import BookListing from '../components/BookListing';
import { addRating, updateRating } from '../actions/ratings';
import { removeFromShelf } from '../actions/shelves';

class Shelves extends Component {
  state = {
    loading: {
      user: true,
      shelves: true,
      shelfItems: true,
      ratings: true,
      userRatings: true
    },
    errors: {
      user: null,
      shelves: null,
      shelfItems: null,
      ratings: null,
      userRatings: null
    },
    user: null,
    shelves: null,
    shelfItems: null,
    ratings: null,
    userRatings: null,
    bookIds: null,
    count: 0,
    limit: 10
  };

  componentDidMount() {
    this.fetchShelves();
    this.fetchShelfItems();
  }

  componentDidUpdate(prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.fetchShelves();
      this.fetchShelfItems();
    }
  }

  fetchShelves = async () => {
    this.setLoading({ shelves: true });
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}/shelves`);
      const { user, shelves } = response.data;
      this.setState({ user, shelves });
      this.setError({ shelves: null });
      this.setLoading({ shelves: false });
    } catch (error) {
      this.setError({ shelves: error.response.statusText });
      this.setLoading({ shelves: false });
    }
  };

  fetchShelfItems = async () => {
    this.setLoading({ shelfItems: true });
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
      const bookIds = items.map(item => item.book_id);
      this.setState({ shelfItems: items, bookIds, count });
      this.setError({ shelfItems: null });
      this.setLoading({ shelfItems: false });

      this.fetchRatings(bookIds);
      this.fetchUserRatings(bookIds);
    } catch (error) {
      this.setError({ shelfItems: error.response.statusText });
      this.setLoading({ shelfItems: false });
    }
  };

  fetchRatings = async bookIds => {
    this.setLoading({ ratings: true });

    const book_ids = (bookIds || this.state.bookIds).join(',');
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: userId, book_ids }
      });
      const { ratings } = response.data;
      this.setState({ ratings });
      this.setError({ ratings: null });
    } catch (error) {
      this.setError({ ratings: error.response.statusText });
    }
    this.setLoading({ ratings: false });
  };

  fetchUserRatings = async bookIds => {
    this.setLoading({ userRatings: true });

    const authUser = this.props.user;
    const userId = parseInt(this.props.match.params.userId);
    if (!authUser.id || userId === authUser.id) {
      this.setLoading({ userRatings: false });
      this.setError({ userRatings: null });
      return;
    }

    const book_ids = (bookIds || this.state.bookIds).join(',');
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: authUser.id, book_ids }
      });
      const { ratings } = response.data;
      this.setState({ userRatings: ratings });
      this.setError({ userRatings: null });
    } catch (error) {
      this.setError({ userRatings: error.response.statusText });
    }
    this.setLoading({ userRatings: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
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
    await removeFromShelf(shelfItem);
    const shelfItems = this.state.shelfItems.filter(
      item => item.id !== shelfItem.id
    );
    this.setState({ shelfItems });
  };

  addRating = async (e, book) => {
    e.preventDefault();
    const rating = 5 - parseInt(e.target.dataset.index);
    const { user } = this.props;
    const newRating = await addRating(rating, book, user);
    const userRatings = [...this.state.userRatings, newRating];
    this.setUserRatings(userRatings);
  };

  updateRating = async (rating, newRating) => {
    await updateRating(rating, newRating);
    const userRatings = this.state.userRatings.map(userRating =>
      userRating.id === rating.id
        ? { ...userRating, rating: newRating }
        : userRating
    );
    this.setUserRatings(userRatings);
  };

  handleUpdateRating = (e, rating) => {
    e.preventDefault();
    const newRating = 5 - parseInt(e.target.dataset.index);
    if (newRating !== rating.rating) this.updateRating(rating, newRating);
  };

  setUserRatings(userRatings) {
    if (this.state.user.id === this.props.user.id)
      return this.setState({ ratings: userRatings, userRatings });
    return this.setState({ userRatings });
  }

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
      errors,
      user,
      shelves,
      shelfItems,
      ratings,
      userRatings,
      count,
      limit
    } = this.state;

    const authUser = this.props.user;

    return (
      <div className="section">
        <Container>
          <Row>
            {/* Shelves */}
            <Col xs={12} lg={3}>
              <h2 className="h5 text-uppercase">Bookshelves</h2>
              <Async
                loading={loading.shelves}
                error={errors.shelves}
                retry={this.fetchShelves}
              >
                {() => (
                  <>
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
                  </>
                )}
              </Async>
            </Col>

            {/* Shelved books */}
            <Col xs={12} lg={9} className="mt-3 mt-md-0">
              <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
              <Async
                loading={
                  loading.shelfItems || loading.ratings || loading.userRatings
                }
                error={
                  errors.shelfItems || errors.ratings || errors.userRatings
                }
                retry={
                  errors.shelfItems
                    ? this.fetchShelfItems
                    : errors.ratings
                    ? () => this.fetchRatings()
                    : () => this.fetchUserRatings()
                }
              >
                {() => (
                  <>
                    <ShelfItemsTable
                      className="d-none d-md-table mt-3"
                      user={user}
                      authUser={authUser}
                      shelfItems={shelfItems}
                      ratings={ratings}
                      userRatings={userRatings}
                      onAddRating={this.addRating}
                      onUpdateRating={this.handleUpdateRating}
                      onDeleteItem={this.removeFromShelf}
                    />
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
                            onAddRating={this.addRating}
                            onUpdateRating={this.handleUpdateRating}
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
                  </>
                )}
              </Async>
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
