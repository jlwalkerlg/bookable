import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import AppRoute from './routes/AppRoute';
import Loading from './views/Loading';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import NotFound from './views/NotFound';
import Show from './views/books/Show';
import Wishlist from './views/Wishlist';
import Category from './views/Category';

const App = ({ loading }) =>
  loading ? (
    <Loading />
  ) : (
    <BrowserRouter>
      <Switch>
        <AppRoute exact path="/" component={Home} />
        <UserRoute exact path="/dashboard" component={Dashboard} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/register" component={Register} />
        <AppRoute exact path="/books/show" component={Show} />
        <AppRoute exact path="/wishlist" component={Wishlist} />
        <AppRoute exact path="/category/:id([0-9]+)" component={Category} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(mapStateToProps)(App);
