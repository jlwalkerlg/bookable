import {
  CART_ADD,
  CART_HYDRATE,
  CART_REMOVE,
  CART_REMOVE_ITEMS
} from '../actions/types';

function cartReducer(cart = {}, action) {
  switch (action.type) {
    case CART_ADD:
      return { ...cart, items: [...cart.items, action.item] };
    case CART_REMOVE:
      return {
        ...cart,
        items: cart.items.filter(item => item.id !== action.id)
      };
    case CART_HYDRATE:
      return action.cart;
    case CART_REMOVE_ITEMS:
      return { ...cart, items: [] };
    default:
      return cart;
  }
}

export default cartReducer;
