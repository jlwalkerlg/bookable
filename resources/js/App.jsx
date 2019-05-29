import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import AppRoute from './routes/AppRoute';
import Loading from './views/Loading';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import NotFound from './views/NotFound';

const App = ({ loading }) =>
  loading ? (
    <Loading />
  ) : (
    <Router>
      <Switch>
        <AppRoute exact path="/" component={Home} />
        <UserRoute exact path="/dashboard" component={Dashboard} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/register" component={Register} />
        <AppRoute component={NotFound} />
      </Switch>
    </Router>
  );

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(mapStateToProps)(App);
