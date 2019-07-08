import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Cart from './Cart';
import { Container } from 'react-bootstrap';
import { removeFromCart } from '../../actions/cart';

class CartContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    items: [],
    isProcessingDelete: false
  };

  source = axios.CancelToken.source();

  async componentDidMount() {
    const { cart } = this.props;

    if (!cart.items.length) return this.setState({ isLoading: false });

    try {
      const response = await axios.get(`/api/carts/${cart.id}/items`, {
        cancelToken: this.source.token,
        params: { with: 'book.author', count: true }
      });
      const { items, count } = response.data;
      this.setState({ items, count, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  handleDeleteItem = async e => {
    e.preventDefault();

    if (this.state.isProcessingDelete) return;

    this.setState({ isProcessingDelete: true });

    const bookId = parseInt(e.target.dataset.bookId);

    try {
      await this.props.removeFromCart(bookId);

      const items = this.state.items.filter(item => item.book_id !== bookId);

      this.setState({ items, isProcessingDelete: false });
    } catch (error) {
      this.setState({ error, isProcessingDelete: false });
    }
  };

  render() {
    return (
      <main className="section">
        <Container>
          <h1 className="mb-4 font-display">Cart</h1>
          <Cart
            isLoading={this.state.isLoading}
            error={this.state.error}
            items={this.state.items}
            isProcessingDelete={this.state.isProcessingDelete}
            onDeleteItem={this.handleDeleteItem}
          />
        </Container>
      </main>
    );
  }
}

CartContainer.propTypes = {
  cart: PropTypes.object.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const mapStateToProps = ({ cart }) => ({
  cart
});

const mapDispatchToProps = {
  removeFromCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartContainer);
