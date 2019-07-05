import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ShelvesList from './ShelvesList';
import Loading from './Loading';

class ShelvesListContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    shelves: [],
    user: {}
  };

  source = axios.CancelToken.source();

  async componentDidMount() {
    const { userId } = this.props;
    try {
      const response = await axios.get(`/api/users/${userId}/shelves`, {
        cancelToken: this.source.token
      });
      const { user, shelves } = response.data;
      this.setState({ user, shelves, isLoading: false });
    } catch (error) {
      if (!axios.isCancel(error)) this.setState({ error, isLoading: false });
    }
  }

  componentWillUnmount() {
    this.source.cancel();
  }

  render() {
    const { isLoading, error, shelves, user } = this.state;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return <ShelvesList shelves={shelves} user={user} />;
  }
}

ShelvesListContainer.propTypes = {
  userId: PropTypes.string.isRequired
};

export default ShelvesListContainer;
