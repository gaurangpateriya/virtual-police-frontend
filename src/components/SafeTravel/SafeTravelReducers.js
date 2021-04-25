import { GET_SAFE_TRAVELS } from '../../constants/actionTypes';

const defaultState = {
  safeTravels: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_SAFE_TRAVELS:
      return {
        ...state,

        safeTravels: action.payload
      };

    default:
      return state;
  }
};
