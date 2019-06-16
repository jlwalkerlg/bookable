import { SHELVES_ADD, SHELVES_REMOVE, SHELVES_HYDRATE } from '../actions/types';

function shelvesReducer(shelves = [], action) {
  switch (action.type) {
    case SHELVES_ADD:
      return shelves.map(shelf =>
        shelf.id === action.shelf.id
          ? { ...shelf, shelf_items: [...shelf.shelf_items, action.item] }
          : shelf
      );
    case SHELVES_REMOVE:
      return shelves.map(shelf =>
        shelf.id === action.shelf.id
          ? {
              ...shelf,
              shelf_items: shelf.shelf_items.filter(
                item => item.id !== action.item.id
              )
            }
          : shelf
      );
    case SHELVES_HYDRATE:
      return action.shelves;
    default:
      return shelves;
  }
}

export default shelvesReducer;
