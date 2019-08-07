import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Collapse from 'react-bootstrap/Collapse';
import BooksFilterForm from './BooksFilterForm';

class BooksFilterFormContainer extends Component {
  state = {
    isFilterOpen: false,
  };

  handleToggle = () =>
    this.setState({ isFilterOpen: !this.state.isFilterOpen });

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isFilterOpen: false });
    this.props.onSubmit();
  };

  render() {
    const { isFilterOpen } = this.state;
    const {
      isLoading,
      error,
      categories,
      params,
      onChange,
      onCategoryChange,
    } = this.props;

    return (
      <>
        <h2 className="h5 text-uppercase mb-3 d-none d-md-block">Filter</h2>
        <h2 className="mb-3 d-md-none">
          <button
            className="btn-reset h5 text-uppercase"
            aria-label="Toggle filter form"
            onClick={this.handleToggle}
          >
            Filter
            <i
              className={
                'material-icons align-top ' +
                (isFilterOpen === true ? 'toggle-collapse-open' : '') +
                (isFilterOpen === false ? 'toggle-collapse-close' : '')
              }
            >
              arrow_drop_down
            </i>
          </button>
        </h2>
        <MediaQuery minWidth={768}>
          {matches => (
            <Collapse in={isFilterOpen || matches}>
              <div>
                <BooksFilterForm
                  isLoading={isLoading}
                  error={error}
                  categories={categories}
                  {...params}
                  onChange={onChange}
                  onSubmit={this.handleSubmit}
                  onCategoryChange={onCategoryChange}
                />
              </div>
            </Collapse>
          )}
        </MediaQuery>
      </>
    );
  }
}

BooksFilterFormContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  categories: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default BooksFilterFormContainer;
