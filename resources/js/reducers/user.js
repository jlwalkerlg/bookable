import { USER_LOGIN, USER_LOGOUT } from '../actions/types';

function userReducer(user = {}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return action.user;
    case USER_LOGOUT:
      return {};
    default:
      return user;
  }
}

export default userReducer;
