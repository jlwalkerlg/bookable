import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Container,
  Badge
} from 'react-bootstrap';
import { logout } from '../actions/user';

class NavBar extends Component {
  logout = e => {
    e.preventDefault();

    this.props
      .logout()
      .then(response => this.handleLogoutSuccess(response))
      .catch(error => this.handleLogoutError(error.response));
  };

  handleLogoutSuccess = response => {
    this.props.history.push('/');
  };

  handleLogoutError = error => {
    console.log(error);
  };

  render() {
    const { user, cart } = this.props;
    const { items } = cart;

    const totalCartItems = items
      ? items.reduce((prev, current) => prev + current.quantity, 0)
      : null;

    return (
      <Navbar
        variant="dark"
        expand="md"
        className="text-uppercase shadow-sm bg-darker"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="font-weight-bold">
            Bookable
          </Navbar.Brand>
          {user.id && (
            <Nav className="d-md-none">
              <Nav.Link as={NavLink} to="/cart" exact>
                <i className="material-icons align-bottom">shopping_cart</i>
                <Badge pill variant="warning" className="align-top">
                  {totalCartItems}
                </Badge>
              </Nav.Link>
            </Nav>
          )}
          <Navbar.Toggle aria-controls="siteNavMenu" />
          <Navbar.Collapse id="siteNavMenu">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/" exact>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/books" exact>
                Books
              </Nav.Link>
              <Nav.Link as={NavLink} to="/categories" exact>
                Categories
              </Nav.Link>
            </Nav>
            <Nav>
              {user.id ? (
                <>
                  <NavDropdown title={user.name} id="siteNavDropdown">
                    <NavDropdown.Item
                      as={NavLink}
                      to={`/users/${user.id}/shelves`}
                      exact
                    >
                      My Books
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={NavLink}
                      to={`/users/${user.id}/ratings`}
                      exact
                    >
                      My Ratings
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={NavLink}
                      to={`/users/${user.id}/reviews`}
                      exact
                    >
                      My Reviews
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={NavLink}
                      to={`/users/${user.id}/quotes`}
                      exact
                    >
                      My Quotes
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/wishlist" exact>
                      Wishlist
                    </NavDropdown.Item>
                    <Form inline onSubmit={this.logout}>
                      <NavDropdown.Item
                        as={Button}
                        type="submit"
                        variant="link"
                        className="text-uppercase"
                      >
                        Logout
                      </NavDropdown.Item>
                    </Form>
                  </NavDropdown>
                  <Nav.Link
                    as={NavLink}
                    to="/cart"
                    exact
                    className="d-none d-md-block"
                  >
                    <i className="material-icons align-bottom">shopping_cart</i>
                    <Badge pill variant="warning" className="align-top">
                      {totalCartItems}
                    </Badge>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login" exact>
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register" exact>
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  user: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({ user, cart }) => ({
  user,
  cart
});

const mapDispatchToProps = {
  logout
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavBar)
);
