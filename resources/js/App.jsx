import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import AppRoute from './routes/AppRoute';
import Loading from './components/Loading';

const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/users/LoginContainer'));
const Register = lazy(() => import('./views/users/RegisterContainer'));
const NotFound = lazy(() => import('./views/NotFound'));
const Books = lazy(() => import('./views/books/Books'));
const Book = lazy(() => import('./views/books/Book'));
const Author = lazy(() => import('./views/authors/Author'));
const Categories = lazy(() => import('./views/categories/Categories'));
const Category = lazy(() => import('./views/categories/CategoryContainer'));
const Wishlist = lazy(() => import('./views/users/WishlistContainer'));
const Cart = lazy(() => import('./views/users/CartContainer'));
const Shelves = lazy(() => import('./views/users/Shelves'));
const Ratings = lazy(() => import('./views/users/RatingsContainer'));
const UsersQuotes = lazy(() => import('./views/users/QuotesContainer'));
const BookQuotes = lazy(() => import('./views/books/BookQuotesContainer'));
const AuthorQuotes = lazy(() =>
  import('./views/authors/AuthorQuotesContainer')
);
const CategoryQuotes = lazy(() =>
  import('./views/categories/CategoryQuotesContainer')
);
const Reviews = lazy(() => import('./views/users/ReviewsContainer'));
const NewReview = lazy(() => import('./views/reviews/NewReview'));
const ReviewShow = lazy(() => import('./views/reviews/ReviewContainer'));
const Checkout = lazy(() => import('./views/checkout/Checkout'));
const CheckoutSuccess = lazy(() =>
  import('./views/checkout/CheckoutSuccessContainer')
);
const User = lazy(() => import('./views/users/User'));
const Orders = lazy(() => import('./views/users/OrdersContainer'));
const PasswordReset = lazy(() => import('./views/PasswordReset'));
const ForgotPassword = lazy(() => import('./views/ForgotPassword'));

const FullScreenLoading = () => (
  <div className="vh-100">
    <Loading />
  </div>
);

const App = ({ loading }) =>
  loading ? (
    <FullScreenLoading />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoading />}>
        <Switch>
          <AppRoute exact path="/" component={Home} />
          <GuestRoute exact path="/login" component={Login} />
          <GuestRoute exact path="/register" component={Register} />
          <AppRoute exact path="/books/:bookId([0-9]+)" component={Book} />
          <AppRoute exact path="/books" component={Books} />
          <AppRoute
            exact
            path="/authors/:authorId([0-9]+)"
            component={Author}
          />
          <UserRoute exact path="/wishlist" component={Wishlist} />
          <UserRoute exact path="/cart" component={Cart} />
          <AppRoute exact path="/categories" component={Categories} />
          <AppRoute
            exact
            path="/categories/:categoryId([0-9]+)"
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
          <UserRoute
            exact
            path="/checkout/success"
            component={CheckoutSuccess}
          />
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
      </Suspense>
    </BrowserRouter>
  );

const mapStateToProps = ({ loading }) => ({
  loading,
});

export default connect(mapStateToProps)(App);
