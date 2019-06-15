import { LOADING_FINISH } from '../actions/types';

function loadingReducer(loading = true, action) {
  switch (action.type) {
    case LOADING_FINISH:
      return false;
    default:
      return loading;
  }
}

export default loadingReducer;
