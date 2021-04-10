import {
  APP_LOAD,
  REDIRECT,
  REGISTER,
  SET_USER,
  TOGEL_DRAWER

} from '../constants/actionTypes';

export const defaultState = {
  appName: 'YAV Student dashboard',
  token: null,
  viewChangeCounter: 0,
  user: {},
  drawerOpen: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
      };
    case REDIRECT:
      return { ...state, redirectTo: action.payload };
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.token,
        currentUser: action.error ? null : action.payload.data.name,
        role: action.payload.role,
        name: action.payload.name,
      };
    case SET_USER:
      return { ...state, user: action.payload };
    case TOGEL_DRAWER:
      return { ...state, drawerOpen: action.payload }
    default:
      return state;
  }
};
