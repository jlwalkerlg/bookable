import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppRoute from '../layouts/AppLayout';

const AuthRoute = ({ user, ...props }) => {
  return user.token ? (
    <AppRoute {...props} />
  ) : (
    <Redirect {...props} to="/login" />
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(AuthRoute);
