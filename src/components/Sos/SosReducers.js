import { GET_SOS } from '../../constants/actionTypes';

const defaultState = {
  sosRequests: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_SOS:
      return {
        ...state,

        sosRequests: action.payload
      };

    default:
      return state;
  }
};
