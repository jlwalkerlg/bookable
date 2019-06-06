import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../includes/NavBar';
import Footer from '../includes/Footer';

const AppRoute = props => (
  <>
    <NavBar {...props} />
    <Route {...props} />
    <Footer {...props} />
  </>
);

export default AppRoute;
