import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CheckoutSuccess from './CheckoutSuccess';
import Loading from '../../components/Loading';

class CheckoutSuccessContainer extends Component {
  state = {
    isLoading: true,
    items: []
  };

  source = axios.CancelToken.source();

  componentDidMount() {
    if (!this.hasCartInState()) return this.props.history.push('/cart');

    this.fetchItems();
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  async fetchItems() {
    const { cart } = this.props.location.state;

    try {
      const response = await axios.get(`/api/carts/${cart.id}/items`, {
        cancelToken: this.source.token,
        params: { with: 'book.author' }
      });

      const { items } = response.data;

      this.setState({ items, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  hasCartInState() {
    const { state } = this.props.location;
    return state && state.cart;
  }

  hasTransactionInState() {
    const { state } = this.props.location;
    return state && state.transaction;
  }

  render() {
    if (!this.hasTransactionInState()) return <Redirect to="/cart" />;

    const { isLoading, error } = this.state;

    if (isLoading)
      return (
        <div className="vh-100-min">
          <Loading />
        </div>
      );

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <CheckoutSuccess
        transaction={this.props.location.state.transaction}
        items={this.state.items}
        user={this.props.user}
      />
    );
  }
}

CheckoutSuccessContainer.propTypes = {
  user: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      cart: PropTypes.object.isRequired,
      transaction: PropTypes.object.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(CheckoutSuccessContainer);
