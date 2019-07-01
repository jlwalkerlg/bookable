import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import URL from '../utils/URL';
import Pagination from '../components/Pagination';

class Orders extends Component {
  state = {
    transactions: [],
    count: 0,
    limit: 10
  };

  componentDidMount() {
    this.fetchOrders();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchOrders();
    }
  }

  fetchOrders = async () => {
    const { user } = this.props;
    const { limit } = this.state;
    const offset = this.calcOffset();
    try {
      const response = await axios.get(`/api/users/${user.id}/transactions`, {
        params: { with: 'cart.items.book.author', limit, offset, count: true }
      });
      const { transactions, count } = response.data;
      this.setState({ transactions, count });
    } catch (error) {
      console.log(error);
    }
  };

  calcOffset() {
    const page = this.getCurrentPage();
    const { limit } = this.state;
    return (page - 1) * limit;
  }

  getCurrentPage() {
    return (
      parseInt(URL.query(this.props.location.search).getParam('page')) || 1
    );
  }

  render() {
    const { transactions, count, limit } = this.state;

    return (
      <div>
        <h1>My Transactions ({count})</h1>

        <ul>
          {transactions.map(transaction => {
            return (
              <li key={transaction.id} className="card mt-2">
                <p>Subtotal: ${(transaction.amount / 100).toFixed(2)}</p>
                <p>
                  Items:{' '}
                  {transaction.cart.items.reduce(
                    (carry, item) => carry + item.quantity,
                    0
                  )}
                </p>
                <p>
                  Books:{' '}
                  {transaction.cart.items
                    .map(item => item.book.title)
                    .join(', ')}
                </p>
              </li>
            );
          })}
        </ul>

        <Pagination
          totalItems={count}
          currentPage={this.getCurrentPage()}
          pageSize={limit}
          maxPages={5}
          url={`${this.props.location.pathname}?page=`}
          className="mt-3 justify-content-center pagination-warning"
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(Orders);
