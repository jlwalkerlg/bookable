import axios from 'axios';

export const addToShelf = async (book, shelf) => {
  const response = await axios.post(`/api/shelves/${shelf.id}/items`, {
    book_id: book.id
  });
  return response.data;
};

export const removeFromShelf = async shelfItem => {
  return await axios.delete(`/api/shelves/items/${shelfItem.id}`);
};
