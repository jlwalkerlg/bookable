import { USER_ADD, USER_REMOVE } from '../actions/types';

function userReducer(user = {}, action) {
  switch (action.type) {
    case USER_ADD:
      return action.user;
    case USER_REMOVE:
      return {};
    default:
      return user;
  }
}

export default userReducer;
