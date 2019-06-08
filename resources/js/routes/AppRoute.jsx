import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../includes/NavBar';
import Footer from '../includes/Footer';

class AppRoute extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return (
      <>
        <NavBar {...this.props} />
        <Route {...this.props} />
        <Footer {...this.props} />
      </>
    );
  }
}

export default AppRoute;
