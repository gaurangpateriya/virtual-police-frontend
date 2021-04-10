import { GET_FIRS } from '../../constants/actionTypes';

const defaultState = {
  firs: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_FIRS:
      return {
        ...state,

        firs: action.payload
      };

    default:
      return state;
  }
};
