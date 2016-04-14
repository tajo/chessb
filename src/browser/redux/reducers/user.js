import actions from '../../../common/actionConstants';
import {Record} from 'immutable';

function getToken() {
  if (window === 'undefined') {
    return null;
  }
  if (localStorage.getItem('token')) {
    return localStorage.getItem('token');
  }
  return null;
}

const InitialState = Record({
  token: getToken(),
  hasPassword: false,
  userId: null,
  gameId: null,
  accountAdded: false,
  accountError: null,
  signInError: null,
});

const initialState = new InitialState;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SERVER_USER_AUTHENTICATE: {
      if (!action.userId) break;
      return state
        .update('userId', () => action.userId)
        .update('hasPassword', () => action.hasPassword)
        .update('token', () => action.token);
    }

    case actions.SERVER_SYNC_BOARD: {
      return state.update('gameId', () => action.game.gameId);
    }

    case actions.USER_ADD_SUCCESS: {
      if (action.payload.err) {
        return state.update('accountError', () => action.payload.err);
      } else {
        return state.update('accountAdded', () => true);
      }
    }

    case actions.USER_SIGN_IN_SUCCESS: {
      if (action.payload.err) {
        return state.update('signInError', () => action.payload.err);
      } else {
        return state.update('signInError', () => null);
      }
    }
  }
  return state;
}
