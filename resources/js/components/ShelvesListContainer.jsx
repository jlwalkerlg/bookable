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

  async componentDidMount() {
    const { userId } = this.props;
    try {
      const response = await axios.get(`/api/users/${userId}/shelves`);
      const { user, shelves } = response.data;
      this.setState({ user, shelves, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
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
