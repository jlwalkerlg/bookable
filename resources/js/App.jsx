import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import AppRoute from './routes/AppRoute';
import Loading from './components/Loading';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import NotFound from './views/NotFound';
import Books from './views/books/Books';
import BooksShow from './views/books/Show';
import AuthorsShow from './views/authors/Show';
import Categories from './views/categories/Categories';
import CategoriesShow from './views/categories/Show';
import Wishlist from './views/Wishlist';
import Cart from './views/Cart';
import Shelves from './views/Shelves';
import Ratings from './views/Ratings';

const App = ({ loading }) =>
  loading ? (
    <div className="vh-100">
      <Loading />
    </div>
  ) : (
    <BrowserRouter>
      <Switch>
        <AppRoute exact path="/" component={Home} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/register" component={Register} />
        <AppRoute exact path="/books/:id([0-9]+)" component={BooksShow} />
        <AppRoute exact path="/books" component={Books} />
        <AppRoute exact path="/authors/:id([0-9]+)" component={AuthorsShow} />
        <UserRoute exact path="/wishlist" component={Wishlist} />
        <UserRoute exact path="/cart" component={Cart} />
        <AppRoute exact path="/categories" component={Categories} />
        <AppRoute
          exact
          path="/category/:id([0-9]+)"
          component={CategoriesShow}
        />
        <AppRoute
          exact
          path="/users/:userId([0-9]+)/shelves"
          component={Shelves}
        />
        <AppRoute
          exact
          path="/users/:userId([0-9]+)/shelves/:shelfId([0-9]+)"
          component={Shelves}
        />
        <AppRoute
          exact
          path="/users/:userId([0-9]+)/ratings"
          component={Ratings}
        />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(mapStateToProps)(App);
