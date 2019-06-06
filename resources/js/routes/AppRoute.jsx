import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../components/NavBar';

const AppRoute = props => (
  <>
    <NavBar {...props} />
    <main>
      <Route {...props} />
    </main>
  </>
);

export default AppRoute;
