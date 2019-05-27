import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppRoute from '../layouts/AppLayout';

const GuestRoute = ({ user, ...props }) => {
  return user.token ? (
    <Redirect {...props} to="/dashboard" />
  ) : (
    <AppRoute {...props} />
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(GuestRoute);
