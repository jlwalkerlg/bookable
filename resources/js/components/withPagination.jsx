import React, { Component } from 'react';
import URL from '../utils/URL';

const withPagination = EnhancedComponent =>
  class WithPagination extends Component {
    state = {
      page: this.getPage()
    };

    componentDidUpdate(prevProps) {
      if (prevProps.location.search !== this.props.location.search) {
        this.setState({ page: this.getPage() });
      }
    }

    calcOffset = limit => (this.state.page - 1) * limit;

    getPage() {
      return (
        parseInt(URL.query(this.props.location.search).getParam('page')) || 1
      );
    }

    render() {
      return (
        <EnhancedComponent
          {...this.props}
          page={this.state.page}
          calcOffset={this.calcOffset}
        />
      );
    }
  };

export default withPagination;
