import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';

const NavBar = ({ user, cartItemsCount, onLogout }) => {
  return (
    <Navbar
      variant="dark"
      expand="md"
      className="text-uppercase shadow-sm bg-darker"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={NavLink} to="/" className="font-weight-bold default">
          Bookable
        </Navbar.Brand>

        {/* Cart Icon */}
        {user.id && (
          <Nav className="d-md-none">
            <Nav.Link as={NavLink} to="/cart" exact>
              <i className="material-icons align-bottom">shopping_cart</i>
              <Badge pill variant="warning" className="align-top">
                {cartItemsCount}
              </Badge>
            </Nav.Link>
          </Nav>
        )}

        {/* Hamburger Toggle */}
        <Navbar.Toggle aria-controls="siteNavMenu" />

        {/* Menu */}
        <Navbar.Collapse id="siteNavMenu">
          {/* Site links */}
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

          {/* User links */}
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
                  <NavDropdown.Item as={NavLink} to={`/users/${user.id}`} exact>
                    Account
                  </NavDropdown.Item>
                  <Form inline onSubmit={onLogout}>
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
                    {cartItemsCount}
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
};

NavBar.propTypes = {
  user: PropTypes.object.isRequired,
  cartItemsCount: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default NavBar;
