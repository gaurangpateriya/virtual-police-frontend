import { GET_EMPLOYEES } from '../../constants/actionTypes';

const defaultState = {
  employees: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_EMPLOYEES:
      return {
        ...state,

        employees: action.payload
      };

    default:
      return state;
  }
};
