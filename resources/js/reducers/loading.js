import { LOADING_FINISH } from '../actions/types';

function loadingReducer(state = true, action) {
  switch (action.type) {
    case LOADING_FINISH:
      return false;
    default:
      return state;
  }
}

export default loadingReducer;
