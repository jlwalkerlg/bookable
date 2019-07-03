import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../actions/user';
import NavBar from './NavBar';

class NavBarContainer extends Component {
  handleLogout = async e => {
    e.preventDefault();

    try {
      await this.props.logout();
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { user, cart } = this.props;

    const cartItemsCount = cart.items
      ? cart.items.reduce((carry, item) => carry + item.quantity, 0)
      : 0;

    return (
      <NavBar
        user={user}
        cartItemsCount={cartItemsCount}
        onLogout={this.handleLogout}
      />
    );
  }
}

NavBarContainer.propTypes = {
  user: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = ({ user, cart }) => ({
  user,
  cart
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarContainer);
