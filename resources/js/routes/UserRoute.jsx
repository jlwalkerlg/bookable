import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppRoute from '../layouts/AppLayout';

const UserRoute = ({ user, ...props }) => {
  return user.id ? (
    <AppRoute {...props} />
  ) : (
    <Redirect {...props} to="/login" />
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(UserRoute);
