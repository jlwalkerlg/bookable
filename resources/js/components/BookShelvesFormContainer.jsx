import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookShelvesForm from './BookShelvesForm';
import Loading from './Loading';

class BookShelvesFormContainer extends Component {
  state = {
    isProcessing: false
  };

  handleAddShelfItem = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const shelf = this.getShelf(e);

    await this.props.addToShelf(shelf);

    this.setState({ isProcessing: false });
  };

  handleRemoveShelfItem = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const shelf = this.getShelf(e);
    const item = shelf.items[0];

    this.props.removeFromShelf(item);

    this.setState({ isProcessing: false });
  };

  getShelf(e) {
    return this.props.shelves.filter(
      shelf => shelf.id === parseInt(e.target.dataset.shelfId)
    )[0];
  }

  render() {
    const { isProcessing } = this.state;
    const { isLoading, error, shelves } = this.props;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <BookShelvesForm
        isProcessing={isProcessing}
        shelves={shelves}
        onAddShelfItem={this.handleAddShelfItem}
        onRemoveShelfItem={this.handleRemoveShelfItem}
      />
    );
  }
}

BookShelvesFormContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  shelves: PropTypes.array.isRequired,
  addToShelf: PropTypes.func.isRequired,
  removeFromShelf: PropTypes.func.isRequired
};

export default BookShelvesFormContainer;
