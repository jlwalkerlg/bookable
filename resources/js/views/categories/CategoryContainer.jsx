import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import withPagination from '../../components/withPagination';
import CategoryHeader from '../../components/CategoryHeader';
import Loading from '../../components/Loading';
import CategoryBooks from '../../components/CategoryBooks';
import CategoryQuotes from '../../components/CategoryQuotes';

class CategoryContainer extends Component {
  state = {
    isLoadingCategory: true,
    isLoadingBooks: true,
    isLoadingQuotes: true,
    errorCategory: null,
    errorBooks: null,
    errorQuotes: null,
    category: {},
    books: [],
    quotes: [],
    count: 0,
    order_by: 'ratings_count',
    order_dir: 'desc'
  };

  limit = 20;

  source = axios.CancelToken.source();

  componentDidMount() {
    this.fetchCategory();
    this.fetchBooks();
    this.fetchQuotes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoadingBooks: true }, this.fetchBooks);
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchCategory() {
    const { categoryId } = this.props.match.params;

    try {
      const response = await axios.get(`/api/categories/${categoryId}`, {
        cancelToken: this.source.token
      });
      const category = response.data;
      this.setState({ category, isLoadingCategory: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorCategory: error, isLoadingCategory: false });
    }
  }

  async fetchBooks() {
    const { categoryId } = this.props.match.params;
    const { order_by, order_dir } = this.state;
    const offset = this.props.calcOffset(this.limit);

    try {
      const response = await axios.get('/api/books', {
        cancelToken: this.source.token,
        params: {
          with: 'author',
          category_id: categoryId,
          limit: this.limit,
          offset,
          order_by,
          order_dir,
          count: true
        }
      });
      const { books, count } = response.data;
      this.setState({ books, count, isLoadingBooks: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorBooks: error, isLoadingBooks: false });
    }
  }

  async fetchQuotes() {
    const { categoryId } = this.props.match.params;

    try {
      const response = await axios.get('/api/quotes', {
        cancelToken: this.source.token,
        params: { category_id: categoryId, limit: 10 }
      });
      const { quotes } = response.data;
      this.setState({ quotes, isLoadingQuotes: false });
    } catch (error) {
      if (!axios.isCancel(error))
        this.setState({ errorQuotes: error, isLoadingQuotes: false });
    }
  }

  handleSortChange = e => {
    const { isLoadingBooks } = this.state;

    if (isLoadingBooks) return;

    const [order_by, order_dir] = e.target.value.split('.');

    this.setState(
      { order_by, order_dir, isLoadingBooks: true },
      this.fetchBooks
    );
  };

  render() {
    const { isLoadingCategory, errorCategory } = this.state;

    if (isLoadingCategory) return <Loading />;

    if (errorCategory)
      return <p>Something went wrong: {errorCategory.message}.</p>;

    return (
      <main>
        <CategoryHeader category={this.state.category} />

        <div className="section">
          <Container>
            <Row>
              <Col xs={12} md={8} className="mb-4 mb-md-0">
                <CategoryBooks
                  books={this.state.books}
                  category={this.state.category}
                  isLoading={this.state.isLoadingBooks}
                  error={this.state.errorBooks}
                  page={this.props.page}
                  count={this.state.count}
                  limit={this.limit}
                  pathname={this.props.location.pathname}
                  onSortChange={this.handleSortChange}
                  orderBy={this.state.order_by}
                  orderDir={this.state.order_dir}
                />
              </Col>
              <Col xs={12} md={4}>
                <CategoryQuotes
                  quotes={this.state.quotes}
                  category={this.state.category}
                  isLoading={this.state.isLoadingQuotes}
                  error={this.state.errorQuotes}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    );
  }
}

CategoryContainer.propTypes = {
  page: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  calcOffset: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withPagination(CategoryContainer);
