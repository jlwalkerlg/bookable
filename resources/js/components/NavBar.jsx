import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
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
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand as={NavLink} to="/">
          Bookable
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="siteNavMenu" />
        <Navbar.Collapse id="siteNavMenu">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            {user.id && (
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user.id ? (
              <Form inline onSubmit={this.logout}>
                <Nav.Link as={Button} type="submit" variant="link">
                  Logout
                </Nav.Link>
              </Form>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
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
