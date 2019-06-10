import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

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
