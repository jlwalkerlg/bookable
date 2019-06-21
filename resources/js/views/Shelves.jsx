import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Table,
  Media,
  Form,
  Button,
  Dropdown
} from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import URL from '../utils/URL';
import Stars from '../components/Stars';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

class Shelves extends Component {
  state = {
    loading: true,
    user: null,
    shelves: null,
    shelfItems: null,
    count: null,
    limit: 10
  };

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.setState({ loading: true });
      this.fetchData();
    }
  }

  async fetchData() {
    try {
      const { user, shelves, shelfItems, count } = await this.fetchShelfData();
      const { userRatings, authUserRatings } = await this.fetchRatingsData(
        shelfItems
      );
      const items = shelfItems.map(item => {
        const userRating =
          userRatings &&
          userRatings.filter(rating => rating.book_id === item.book_id)[0];
        const authUserRating =
          authUserRatings &&
          authUserRatings.filter(rating => rating.book_id === item.book_id)[0];
        return { ...item, userRating, authUserRating };
      });
      this.setState({
        user,
        shelves,
        shelfItems: items,
        count,
        userRatings,
        authUserRatings,
        loading: false
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchShelfData() {
    try {
      const [{ user, shelves }, { items, count }] = await axios.all([
        this.fetchShelves(),
        this.fetchShelfItems()
      ]);
      return { user, shelves, shelfItems: items, count };
    } catch (error) {
      console.log(error);
    }
  }

  async fetchRatingsData(shelfItems) {
    try {
      const [userRatings, authUserRatings] = await axios.all([
        this.fetchUserRatings(shelfItems),
        this.fetchAuthUserRatings(shelfItems)
      ]);
      return { userRatings, authUserRatings };
    } catch (error) {
      console.log(error);
    }
  }

  async fetchShelves() {
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}/shelves`);
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
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchUserRatings(shelfItems) {
    const { userId } = this.props.match.params;
    const { user } = this.props;
    if (user.id === parseInt(userId)) return null;
    const bookIds = shelfItems.map(item => item.book_id);
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: userId, book_ids: bookIds.join(',') }
      });
      return response.data.ratings;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAuthUserRatings(shelfItems) {
    const { user } = this.props;
    if (!user.id) return null;
    const bookIds = shelfItems.map(item => item.book_id);
    try {
      const response = await axios.get('/api/ratings', {
        params: { user_id: user.id, book_ids: bookIds.join(',') }
      });
      return response.data.ratings;
    } catch (error) {
      console.log(error);
    }
  }

  needsUpdate(prevProps) {
    return (
      prevProps.match.params.shelfId !== this.props.match.params.shelfId ||
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

  render() {
    const { loading, user, shelves, shelfItems, count, limit } = this.state;
    const authUser = !loading && this.props.user;
    const isOwnShelf = !loading && user.id === authUser.id;

    return (
      <div className="section">
        <Container>
          <Row>
            <Col xs={12} lg={3} className="mb-4 mb-md-none">
              <h2 className="h5 text-uppercase">Bookshelves</h2>
              {loading ? (
                <Loading />
              ) : (
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
            </Col>
            <Col xs={12} lg={9}>
              <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <Table responsive className="d-none d-md-table mb-3">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Average Rating</th>
                        {!isOwnShelf && <th>User Rating</th>}
                        {authUser.id && <th>Your Rating</th>}
                        <th>Date Added</th>
                        {isOwnShelf && <th />}
                      </tr>
                    </thead>
                    <tbody>
                      {shelfItems.map((shelfItem, index) => {
                        const { book, userRating, authUserRating } = shelfItem;
                        const { author } = book;

                        return (
                          <tr key={index}>
                            <td>
                              <img
                                src={book.small_image_url}
                                alt={book.title}
                              />
                            </td>
                            <td>
                              <Link to={`/books/${book.id}`}>{book.title}</Link>
                            </td>
                            <td>
                              <Link to={`/authors/${author.id}`}>
                                {author.name}
                              </Link>
                            </td>
                            <td>{book.avg_rating.toFixed(2)}</td>
                            {!isOwnShelf && (
                              <td className="text-nowrap">
                                <Stars
                                  rating={
                                    (userRating && userRating.rating) || 0
                                  }
                                />
                              </td>
                            )}
                            {authUser.id && (
                              <td className="text-nowrap">
                                <Stars
                                  rating={
                                    (authUserRating && authUserRating.rating) ||
                                    0
                                  }
                                />
                              </td>
                            )}
                            <td>{shelfItem.created_at}</td>
                            {isOwnShelf && (
                              <td>
                                <Form
                                  action="/"
                                  method="POST"
                                  onSubmit={e =>
                                    this.removeFromShelf(e, shelfItem)
                                  }
                                >
                                  <Button
                                    variant="link"
                                    type="submit"
                                    className="text-danger p-0"
                                  >
                                    <i className="material-icons">clear</i>
                                  </Button>
                                </Form>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div className="d-md-none mb-3">
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
                                <span className="text-secondary">
                                  User rating:
                                </span>{' '}
                                <Stars
                                  rating={
                                    (userRating && userRating.rating) || 0
                                  }
                                />
                              </p>
                            )}
                            {authUser.id && (
                              <p className="font-size-7 mb-2">
                                <span className="text-secondary">
                                  Your rating:
                                </span>{' '}
                                <Stars
                                  rating={
                                    (authUserRating && authUserRating.rating) ||
                                    0
                                  }
                                />
                              </p>
                            )}
                            <p className="font-size-7 mb-2">
                              <span className="text-secondary">
                                Date Added:
                              </span>{' '}
                              {shelfItem.created_at}
                            </p>
                            {isOwnShelf && (
                              <Form
                                action="/"
                                method="POST"
                                onSubmit={e =>
                                  this.removeFromShelf(e, shelfItem)
                                }
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
