import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import AppRoute from './routes/AppRoute';
import Loading from './components/Loading';
import Home from './views/Home';
import Login from './views/users/LoginContainer';
import Register from './views/users/RegisterContainer';
import NotFound from './views/NotFound';
import Books from './views/books/Books';
import Book from './views/books/Book';
import Author from './views/authors/Author';
import Categories from './views/categories/Categories';
import Category from './views/categories/CategoryContainer';
import Wishlist from './views/users/WishlistContainer';
import Cart from './views/users/CartContainer';
import Shelves from './views/users/Shelves';
import Ratings from './views/users/RatingsContainer';
import UsersQuotes from './views/users/QuotesContainer';
import BookQuotes from './views/books/BookQuotes';
import AuthorQuotes from './views/authors/AuthorQuotes';
import CategoryQuotes from './views/categories/CategoryQuotes';
import Reviews from './views/users/ReviewsContainer';
import NewReview from './views/reviews/NewReview';
import ReviewShow from './views/reviews/ReviewContainer';
import Checkout from './views/checkout/Checkout';
import CheckoutSuccess from './views/checkout/CheckoutSuccessContainer';
import User from './views/users/User';
import Orders from './views/users/OrdersContainer';
import PasswordReset from './views/PasswordReset';
import ForgotPassword from './views/ForgotPassword';

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
        <AppRoute exact path="/books/:bookId([0-9]+)" component={Book} />
        <AppRoute exact path="/books" component={Books} />
        <AppRoute exact path="/authors/:authorId([0-9]+)" component={Author} />
        <UserRoute exact path="/wishlist" component={Wishlist} />
        <UserRoute exact path="/cart" component={Cart} />
        <AppRoute exact path="/categories" component={Categories} />
        <AppRoute
          exact
          path="/category/:categoryId([0-9]+)"
          component={Category}
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
        <AppRoute
          exact
          path="/users/:userId([0-9]+)/reviews"
          component={Reviews}
        />
        <AppRoute
          exact
          path="/users/:userId([0-9]+)/quotes"
          component={UsersQuotes}
        />
        <AppRoute
          exact
          path="/books/:bookId([0-9]+)/quotes"
          component={BookQuotes}
        />
        <AppRoute
          exact
          path="/authors/:authorId([0-9]+)/quotes"
          component={AuthorQuotes}
        />
        <AppRoute
          exact
          path="/categories/:categoryId([0-9]+)/quotes"
          component={CategoryQuotes}
        />
        <UserRoute
          exact
          path="/books/:bookId([0-9]+)/reviews/new"
          component={NewReview}
        />
        <AppRoute
          exact
          path="/reviews/:reviewId([0-9]+)"
          component={ReviewShow}
        />
        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/checkout/success" component={CheckoutSuccess} />
        <AppRoute exact path="/users/:userId([0-9]+)" component={User} />
        <UserRoute exact path="/orders" component={Orders} />
        <AppRoute
          exact
          path="/passwords/reset/:token"
          component={PasswordReset}
        />
        <AppRoute exact path="/forgot-password" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );

const mapStateToProps = ({ loading }) => ({
  loading
});

export default connect(mapStateToProps)(App);
