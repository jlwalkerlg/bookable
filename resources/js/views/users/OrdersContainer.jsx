import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import withPagination from '../../components/withPagination';
import { Container } from 'react-bootstrap';
import Orders from './Orders';

class OrdersContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    transactions: [],
    count: 0
  };

  limit = 10;

  componentDidMount() {
    this.fetchOrders();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.setState({ isLoading: true }, this.fetchOrders);
    }
  }

  async fetchOrders() {
    const { user } = this.props;
    const offset = this.props.calcOffset(this.limit);

    try {
      const response = await axios.get(`/api/users/${user.id}/transactions`, {
        params: {
          with: 'cart.items.book.author',
          limit: this.limit,
          offset,
          count: true
        }
      });

      const { transactions, count } = response.data;
      this.setState({ transactions, count, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    return (
      <main className="section">
        <Container>
          <h1 className="h4">My Orders</h1>

          <Orders
            isLoading={this.state.isLoading}
            error={this.state.error}
            transactions={this.state.transactions}
            count={this.state.count}
            limit={this.limit}
            page={this.props.page}
            pathname={this.props.location.pathname}
          />
        </Container>
      </main>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default withPagination(connect(mapStateToProps)(OrdersContainer));
