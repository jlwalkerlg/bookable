import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Container
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
    const { user } = this.props;

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
          <Navbar.Toggle aria-controls="siteNavMenu" />
          <Navbar.Collapse id="siteNavMenu">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/" exact>
                Home
              </Nav.Link>
            </Nav>
            <Nav>
              {user.id ? (
                <NavDropdown title="Jordan Walker" id="siteNavDropdown">
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

const mapStateToProps = state => ({
  user: state.user
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
