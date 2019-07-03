import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBarContainer from '../components/NavBarContainer';
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
        <NavBarContainer {...this.props} />
        <Route {...this.props} />
        <Footer {...this.props} />
      </>
    );
  }
}

export default AppRoute;
