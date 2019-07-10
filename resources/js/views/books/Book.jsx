import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { addRating, updateRating, deleteRating } from '../../actions/ratings';
import { addToShelf, removeFromShelf } from '../../actions/shelves';
import Loading from '../../components/Loading';
import BookDisplay from '../../components/BookDisplay';
import BookAbout from '../../components/BookAbout';
import BookAuthor from '../../components/BookAuthor';
import BookSimilarBooks from '../../components/BookSimilarBooks';
import BookUserReview from '../../components/BookUserReview';
import BookReviews from '../../components/BookReviews';

class Book extends Component {
  state = {
    isLoading: true,
    isProcessingRating: false
  };

  source = axios.CancelToken.source();

  componentWillUnmount() {
    this.source.cancel();
  }

  initState(callback) {
    this.setState(
      {
        isLoadingBook: true,
        isLoadingBooks: true,
        isLoadingQuotes: true,
        isLoadingReviews: false,
        isLoadingUserReview: true,
        isLoadingUserRating: true,
        isLoadingShelves: true,
        errorBook: null,
        errorBooks: null,
        errorQuotes: null,
        errorReviews: null,
        errorUserReview: null,
        errorUserRating: null,
        errorShelves: null,
        book: {},
        books: [],
        quotes: [],
        reviews: [],
        userReview: {},
        userRating: {},
        shelves: [],
        countReviews: 0,
        offsetReviews: 0
      },
      callback
    );
  }

  componentDidMount() {
    this.initState(this.fetchData);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.bookId !== this.props.match.params.bookId) {
      this.initState(this.fetchData);
    }
  }

  fetchData() {
    const { user } = this.props;

    this.fetchBook();
    this.fetchSimilarBooks();
    this.fetchReviews();
    this.fetchQuotes();
    if (user.id) {
      this.fetchUserRating();
      this.fetchUserReview();
      this.fetchShelfData();
    } else {
      this.setState({ isLoadingUserRating: false, isLoadingUserReview: false });
    }

    this.setState({ isLoading: false });
  }

  async fetchBook() {
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get(`/api/books/${bookId}`, {
        cancelToken: this.source.token,
        params: { with: 'author.books,categories' }
      });
      const book = response.data;
      this.setState({ book, isLoadingBook: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorBook: error, isLoadingBook: false });
    }
  }

  async fetchQuotes() {
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get('/api/quotes', {
        cancelToken: this.source.token,
        params: { book_id: bookId, limit: 5 }
      });
      const { quotes } = response.data;
      this.setState({ quotes, isLoadingQuotes: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setError({ errorQuotes: error, isLoadingQuotes: false });
    }
  }

  async fetchUserRating() {
    const { user } = this.props;
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get('/api/ratings', {
        cancelToken: this.source.token,
        params: { book_id: bookId, user_id: user.id }
      });
      const userRating = response.data.ratings[0] || {};
      this.setState({ userRating, isLoadingUserRating: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorUserRating: error, isLoadingUserRating: false });
    }
  }

  fetchReviews = async () => {
    if (this.state.isLoadingReviews) return;

    this.setState({ isLoadingReviews: true });

    const { bookId } = this.props.match.params;
    const { offsetReviews } = this.state;

    try {
      const response = await axios.get('/api/reviews', {
        cancelToken: this.source.token,
        params: {
          book_id: bookId,
          with: 'user',
          limit: 5,
          count: true,
          offset: offsetReviews
        }
      });
      let { reviews, count } = response.data;

      const ratings = await this.fetchRatings(reviews);

      reviews = reviews
        .filter(review => review.user_id !== this.props.user.id)
        .map(review => ({
          ...review,
          rating: ratings.filter(rating => rating.user_id === review.user_id)[0]
        }));

      this.setState({
        reviews: [...this.state.reviews, ...reviews],
        countReviews: count,
        offsetReviews: offsetReviews + response.data.reviews.length,
        isLoadingReviews: false
      });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({
          errorReviews: error,
          isLoadingReviews: false
        });
    }
  };

  async fetchRatings(reviews) {
    const userIds = reviews.map(review => review.user_id).join(',');
    const { bookId } = this.props.match.params;

    const response = await axios.get('/api/ratings', {
      cancelToken: this.source.token,
      params: { book_id: bookId, user_ids: userIds }
    });
    return response.data.ratings;
  }

  async fetchUserReview() {
    const { user } = this.props;
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get('/api/reviews', {
        cancelToken: this.source.token,
        params: { book_id: bookId, user_id: user.id }
      });
      const userReview = response.data.reviews[0] || {};
      this.setState({
        userReview,
        isLoadingUserReview: false
      });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorUserReview: error, isLoadingUserReview: false });
    }
  }

  async fetchSimilarBooks() {
    const { bookId } = this.props.match.params;

    try {
      const response = await axios.get(`/api/books/${bookId}/similar`, {
        cancelToken: this.source.token,
        params: { limit: 15 }
      });
      const books = response.data;
      this.setState({ books, isLoadingBooks: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorBooks, isLoadingBooks: false });
    }
  }

  async fetchShelfData() {
    try {
      const [userShelves, userShelfItems] = await axios.all([
        this.fetchUserShelves(),
        this.fetchUserShelfItems()
      ]);

      const shelves = userShelves.map(shelf => ({
        ...shelf,
        items: userShelfItems.filter(item => item.shelf_id === shelf.id)
      }));

      this.setState({ shelves, isLoadingShelves: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorShelves, isLoadingShelves: false });
    }
  }

  async fetchUserShelves() {
    const { user } = this.props;

    const response = await axios.get('/api/shelves', {
      cancelToken: this.source.token,
      params: { user_id: user.id }
    });
    return response.data.shelves;
  }

  async fetchUserShelfItems() {
    const { user } = this.props;
    const { bookId } = this.props.match.params;

    const response = await axios.get('/api/shelves/items', {
      cancelToken: this.source.token,
      params: { book_id: bookId, user_id: user.id }
    });
    return response.data.items;
  }

  addToShelf = async shelf => {
    const { book } = this.state;

    try {
      const item = await addToShelf(book, shelf);
      const shelves = this.state.shelves.map(shelf =>
        shelf.id !== item.shelf_id ? shelf : { ...shelf, items: [item] }
      );
      this.setState({ shelves });
    } catch (error) {
      this.setState({ errorShelves: error });
    }
  };

  removeFromShelf = async item => {
    try {
      await removeFromShelf(item.id);
      const shelves = this.state.shelves.map(shelf =>
        shelf.id !== item.shelf_id ? shelf : { ...shelf, items: [] }
      );
      this.setState({ shelves });
    } catch (error) {
      this.setState({ errorShelves: error });
    }
  };

  handleAddRating = async e => {
    e.preventDefault();

    const { isProcessingRating } = this.state;
    if (isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const { user } = this.props;
    const { book } = this.state;
    const rating = 5 - parseInt(e.target.dataset.index);

    try {
      const userRating = await addRating(rating, book.id, user.id);
      this.setState({ userRating, isProcessingRating: false });
    } catch (error) {
      console.log(error);
      this.setState({ errorUserRating: error, isProcessingRating: false });
    }
  };

  handleUpdateRating = async e => {
    e.preventDefault();

    const { isProcessingRating } = this.state;
    if (isProcessingRating) return;

    this.setState({ isProcessingRating: true });

    const { userRating } = this.state;
    let newRating = 5 - parseInt(e.target.dataset.index);

    try {
      newRating === userRating.rating
        ? await this.deleteRating()
        : await this.updateRating(newRating);
      this.setState({ isProcessingRating: false });
    } catch (error) {
      this.setState({ errorUserRating: error, isProcessingRating: false });
    }
  };

  async updateRating(newRating) {
    const { userRating } = this.state;

    await updateRating(userRating.id, newRating);

    this.setState({
      userRating: { ...this.state.userRating, rating: newRating }
    });
  }

  async deleteRating() {
    const { userRating } = this.state;

    await deleteRating(userRating.id);

    this.setState({ userRating: {} });
  }

  render() {
    const { isLoading, isLoadingBook, errorBook } = this.state;

    if (isLoading || isLoadingBook) return <Loading />;

    if (errorBook) return <p>Something went wrong: {errorBook.message}.</p>;

    const { user } = this.props;

    const userReview = {
      ...this.state.userReview,
      rating: this.state.userRating
    };

    return (
      <>
        <BookDisplay
          book={this.state.book}
          user={this.props.user}
          shelves={this.state.shelves}
          isLoadingShelves={this.state.isLoadingShelves}
          errorShelves={this.state.errorShelves}
          addToShelf={this.addToShelf}
          removeFromShelf={this.removeFromShelf}
          isProcessingRating={this.state.isProcessingRating}
          userRating={this.state.userRating}
          onAddRating={this.handleAddRating}
          onUpdateRating={this.handleUpdateRating}
        />
        <BookAbout
          book={this.state.book}
          quotes={this.state.quotes}
          isLoadingQuotes={this.state.isLoadingQuotes}
          errorQuotes={this.state.errorQuotes}
        />
        <BookAuthor author={this.state.book.author} />
        <BookSimilarBooks
          books={this.state.books}
          isLoading={this.state.isLoadingBooks}
          error={this.state.errorBooks}
        />
        <article id="reviews" className="section">
          <Container>
            <h3 className="text-uppercase mb-3 h6">Reviews</h3>
            {user.id && (
              <BookUserReview
                book={this.state.book}
                isLoading={this.state.isLoadingUserReview}
                error={this.state.errorUserReview}
                review={userReview}
                user={user}
              />
            )}
            <div className="mt-3">
              <BookReviews
                isLoading={this.state.isLoadingReviews}
                error={this.state.errorReviews}
                reviews={this.state.reviews}
                onFetchReviews={this.fetchReviews}
                countReviews={this.state.countReviews}
                countUserReview={this.state.userReview.id ? 1 : 0}
              />
            </div>
          </Container>
        </article>
      </>
    );
  }
}

Book.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      bookId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Book);
