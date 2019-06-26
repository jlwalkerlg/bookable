import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import BookCarousel from '../components/BookCarousel';
import FeaturedBook from '../components/FeaturedBook';
import Async from '../components/Async';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: {
        bestSeller: true,
        newBooks: true,
        featuredBooks: true,
        penguinBooks: true,
        trendingCategoryBook: true
      },
      errors: {
        bestSeller: null,
        newBooks: null,
        featuredBooks: null,
        penguinBooks: null,
        trendingCategoryBook: null
      },
      trendingCategory: props.categories[0],
      bestSeller: null,
      newBooks: null,
      featuredBooks: null,
      penguinBooks: null,
      trendingCategoryBook: null
    };
  }

  componentDidMount() {
    this.fetchBestSeller();
    this.fetchNewBooks();
    this.fetchFeaturedBooks();
    this.fetchPenguinBooks();
    this.fetchTrendingCategoryBook();
  }

  fetchBestSeller = async () => {
    this.setLoading({ bestSeller: true });
    try {
      const response = await axios.get('/api/books', {
        params: {
          limit: 1,
          order_by: 'ratings_count',
          order_dir: 'desc',
          with: 'author'
        }
      });
      const bestSeller = response.data.books[0];
      this.setState({ bestSeller });
      this.setError({ bestSeller: null });
    } catch (error) {
      this.setError({ bestSeller: error.response.statusText });
    }
    this.setLoading({ bestSeller: false });
  };

  fetchNewBooks = async () => {
    this.setLoading({ newBooks: true });
    try {
      const response = await axios.get('/api/books', {
        params: {
          limit: 15,
          order_by: 'publication_date',
          order_dir: 'desc',
          with: 'author'
        }
      });
      const newBooks = response.data.books;
      this.setState({ newBooks });
      this.setError({ newBooks: null });
    } catch (error) {
      this.setError({ newBooks: error.response.statusText });
    }
    this.setLoading({ newBooks: false });
  };

  fetchFeaturedBooks = async () => {
    this.setLoading({ featuredBooks: true });
    try {
      const response = await axios.get('/api/books', {
        params: { limit: 15, order_by: 'random', with: 'author' }
      });
      const featuredBooks = response.data.books;
      this.setState({ featuredBooks });
      this.setError({ featuredBooks: null });
    } catch (error) {
      this.setError({ featuredBooks: error.response.statusText });
    }
    this.setLoading({ featuredBooks: false });
  };

  fetchPenguinBooks = async () => {
    this.setLoading({ penguinBooks: true });
    try {
      const response = await axios.get('/api/books', {
        params: {
          limit: 15,
          publisher: 'Penguin Books',
          with: 'author'
        }
      });
      const penguinBooks = response.data.books;
      this.setState({ penguinBooks });
      this.setError({ penguinBooks: null });
    } catch (error) {
      this.setError({ penguinBooks: error.response.statusText });
    }
    this.setLoading({ penguinBooks: false });
  };

  fetchTrendingCategoryBook = async () => {
    this.setLoading({ trendingCategoryBook: true });
    try {
      const { trendingCategory } = this.state;
      const response = await axios.get('/api/books', {
        params: {
          limit: 1,
          order_by: 'ratings_count',
          order_dir: 'desc',
          category_id: trendingCategory.id,
          with: 'author'
        }
      });
      const trendingCategoryBook = response.data.books[0];
      this.setState({ trendingCategoryBook });
      this.setError({ trendingCategoryBook: null });
    } catch (error) {
      this.setError({ trendingCategoryBook: error.response.statusText });
    }
    this.setLoading({ trendingCategoryBook: false });
  };

  setLoading(loading) {
    this.setState({ loading: { ...this.state.loading, ...loading } });
  }

  setError(error) {
    this.setState({ errors: { ...this.state.errors, ...error } });
  }

  render() {
    const {
      loading,
      errors,
      bestSeller,
      newBooks,
      featuredBooks,
      penguinBooks,
      trendingCategory,
      trendingCategoryBook
    } = this.state;

    return (
      <>
        {/* SITE HEAD */}
        <header className="site-head">
          <div className="text-center">
            <h1 className="site-head__title">Welcome to Bookable</h1>
            <p className="mb-4 site-head__subtitle">Fall in love with books.</p>
            <Link
              to="/"
              className="btn btn-outline-light btn-lg rounded-pill site-head__cta"
            >
              Shop Now
            </Link>
          </div>
        </header>

        {/* BEST SELLER */}
        <article className="bg-beige section text-center">
          <Async
            loading={loading.bestSeller}
            error={errors.bestSeller}
            retry={this.fetchBestSeller}
          >
            {() => (
              <FeaturedBook
                title="Best Seller"
                book={bestSeller}
                author={bestSeller.author}
                variant="middle"
              />
            )}
          </Async>
        </article>

        {/* NEW BOOKS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>New Books</span>
            </h2>
            <Async
              loading={loading.newBooks}
              error={errors.newBooks}
              retry={this.fetchNewBooks}
            >
              {() => <BookCarousel books={newBooks} jagged={true} />}
            </Async>
          </Container>
        </article>

        {/* FEATURED BOOKS */}
        <article className="section text-center bg-beige">
          <Container>
            <h2 className="heading mb-5">
              <span>Featured Books</span>
            </h2>
            <Async
              loading={loading.featuredBooks}
              error={errors.featuredBooks}
              retry={this.fetchFeaturedBooks}
            >
              {() => <BookCarousel books={featuredBooks} jagged={true} />}
            </Async>
          </Container>
        </article>

        {/* PENGUIN CLASSICS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>Penguin Classics</span>
            </h2>
            <Async
              loading={loading.penguinBooks}
              error={errors.penguinBooks}
              retry={this.fetchPenguinBooks}
            >
              {() => (
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  {penguinBooks.map((book, index) => (
                    <ProductCard key={index} book={book} className="mx-3" />
                  ))}
                </div>
              )}
            </Async>
          </Container>
        </article>

        {/* CATEGORY FEATURE */}
        <article className="bg-beige section text-center">
          <Async
            loading={loading.trendingCategoryBook}
            error={errors.trendingCategoryBook}
            retry={this.fetchTrendingCategoryBook}
          >
            {() => (
              <FeaturedBook
                title={() => (
                  <>
                    <span>Trending in</span>{' '}
                    <Link to={`/categories/${trendingCategory.id}`}>
                      {trendingCategory.name}
                    </Link>
                  </>
                )}
                book={trendingCategoryBook}
                author={trendingCategoryBook.author}
                variant="left"
              />
            )}
          </Async>
        </article>
      </>
    );
  }
}

const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps)(Home);
