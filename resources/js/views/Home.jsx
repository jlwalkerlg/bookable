import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import BookCarousel from '../components/BookCarousel';
import sanitize from '../utils/sanitize';
import FeaturedBook from '../components/FeaturedBook';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      bestSeller: null,
      newBooks: null,
      featuredBooks: null,
      penguinBooks: null,
      trendingCategory: props.categories[0],
      trendingCategoryBook: null
    };
  }

  async componentDidMount() {
    const [
      bestSeller,
      newBooks,
      featuredBooks,
      penguinBooks,
      trendingCategoryBook
    ] = await this.fetchData();
    this.setState({
      bestSeller: bestSeller.data.books[0],
      newBooks: newBooks.data.books,
      featuredBooks: featuredBooks.data.books,
      penguinBooks: penguinBooks.data.books,
      trendingCategoryBook: trendingCategoryBook.data.books[0],
      loading: false
    });
  }

  async fetchData() {
    try {
      const res = await axios.all([
        this.fetchBestSeller(),
        this.fetchNewBooks(),
        this.fetchFeaturedBooks(),
        this.fetchPenguinBooks(),
        this.fetchTrendingCategory()
      ]);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  fetchBestSeller() {
    return axios.get('/api/books', {
      params: {
        limit: 1,
        order_by: 'ratings_count',
        order_dir: 'desc',
        with: 'author'
      }
    });
  }

  fetchNewBooks() {
    return axios.get('/api/books', {
      params: {
        limit: 15,
        order_by: 'publication_date',
        order_dir: 'desc',
        with: 'author'
      }
    });
  }

  fetchFeaturedBooks() {
    return axios.get('/api/books', {
      params: { limit: 15, order_by: 'random', with: 'author' }
    });
  }

  fetchPenguinBooks() {
    return axios.get('/api/books', {
      params: {
        limit: 15,
        publisher: 'Penguin Books',
        with: 'author'
      }
    });
  }

  async fetchTrendingCategory() {
    const { trendingCategory } = this.state;
    return axios.get('/api/books', {
      params: {
        limit: 1,
        order_by: 'ratings_count',
        order_dir: 'desc',
        category_id: trendingCategory.id,
        with: 'author'
      }
    });
  }

  render() {
    const {
      loading,
      bestSeller,
      newBooks,
      featuredBooks,
      penguinBooks,
      trendingCategory,
      trendingCategoryBook
    } = this.state;

    return loading ? (
      <div className="vh-100-nav">
        <Loading />
      </div>
    ) : (
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
          <FeaturedBook
            title="Best Seller"
            book={bestSeller}
            author={bestSeller.author}
            variant="middle"
          />
        </article>
        {/* NEW BOOKS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>New Books</span>
            </h2>
            <BookCarousel books={newBooks} jagged={true} />
          </Container>
        </article>
        {/* FEATURED BOOKS */}
        <article className="section text-center bg-beige">
          <Container>
            <h2 className="heading mb-5">
              <span>Featured Books</span>
            </h2>
            <BookCarousel books={featuredBooks} jagged={true} />
          </Container>
        </article>
        {/* PENGUIN CLASSICS */}
        <article className="section text-center">
          <Container>
            <h2 className="heading mb-5">
              <span>Penguin Classics</span>
            </h2>
            <div className="d-flex justify-content-center flex-wrap mb-4">
              {penguinBooks.map((book, index) => (
                <ProductCard key={index} book={book} className="mx-3" />
              ))}
            </div>
          </Container>
        </article>
        {/* PHILOSOPHY FEATURE */}
        <article className="bg-beige section text-center">
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
        </article>
      </>
    );
  }
}

const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps)(Home);
