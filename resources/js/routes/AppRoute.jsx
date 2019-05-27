import React from 'react';
import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

const AppRoute = ({ component, ...routeProps }) => (
  <Route
    {...routeProps}
    render={props => <AppLayout {...props} component={component} />}
  />
);

export default AppRoute;
