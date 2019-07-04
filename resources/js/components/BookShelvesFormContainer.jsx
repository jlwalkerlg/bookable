import React, { Component } from 'react';
import axios from 'axios';
import BookShelvesForm from './BookShelvesForm';
import Loading from './Loading';
import { addToShelf, removeFromShelf } from '../actions/shelves';

class BookShelvesFormContainer extends Component {
  state = {
    isLoading: true,
    error: null,
    shelves: [],
    isProcessing: false
  };

  async componentDidMount() {
    try {
      const [userShelves, userShelfItems] = await axios.all([
        this.fetchUserShelves(),
        this.fetchUserShelfItems()
      ]);
      const shelves = userShelves.map(shelf => ({
        ...shelf,
        items: userShelfItems.filter(item => item.shelf_id === shelf.id)
      }));
      this.setState({ shelves, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  async fetchUserShelves() {
    const { user } = this.props;
    const response = await axios.get('/api/shelves', {
      params: { user_id: user.id }
    });
    return response.data.shelves;
  }

  async fetchUserShelfItems() {
    const { user, book } = this.props;
    const response = await axios.get('/api/shelves/items', {
      params: { book_id: book.id, user_id: user.id }
    });
    return response.data.items;
  }

  handleRemoveShelfItem = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const shelf = this.getShelf(e);
    const item = shelf.items[0];

    try {
      await removeFromShelf(item);
      const shelves = this.state.shelves.map(shelf =>
        shelf.id !== item.shelf_id ? shelf : { ...shelf, items: [] }
      );
      this.setState({ shelves });
    } catch (error) {
      this.setState({ error });
    }

    this.setState({ isProcessing: false });
  };

  handleAddShelfItem = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const { book } = this.props;
    const shelf = this.getShelf(e);

    try {
      const item = await addToShelf(book, shelf);
      const shelves = this.state.shelves.map(shelf =>
        shelf.id !== item.shelf_id ? shelf : { ...shelf, items: [item] }
      );
      this.setState({ shelves });
    } catch (error) {
      this.setState({ error });
    }

    this.setState({ isProcessing: false });
  };

  getShelf(e) {
    return this.state.shelves.filter(
      shelf => shelf.id === parseInt(e.target.dataset.shelfId)
    )[0];
  }

  render() {
    const { isLoading, error, shelves, isProcessing } = this.state;

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

export default BookShelvesFormContainer;
