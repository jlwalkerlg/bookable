import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppRoute from './AppRoute';

const GuestRoute = ({ user, ...props }) => {
  return user.id ? <Redirect {...props} to="/" /> : <AppRoute {...props} />;
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(GuestRoute);
