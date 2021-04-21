import { GET_NOCS } from '../../constants/actionTypes';

const defaultState = {
  nocs: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_NOCS:
      return {
        ...state,

        nocs: action.payload
      };

    default:
      return state;
  }
};
