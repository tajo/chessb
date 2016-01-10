import actions from '../../../common/actionConstants';
import shortid from 'shortid';
import {Record} from 'immutable';

function getHashId() {
  if (window === 'undefined') {
    return null;
  }
  if (localStorage.getItem('hashId')) {
    return localStorage.getItem('hashId');
  }
  const hashId = shortid.generate();
  localStorage.setItem('hashId', hashId);
  return hashId;
}

const InitialState = Record({
  hashId: getHashId(),
  userId: null,
  gameId: null
});

const initialState = new InitialState;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SERVER_USER_AUTHENTICATE: {
      if (!action.userId) break;
      return state.update('userId', () => action.userId);
    }

    case actions.SERVER_SYNC_BOARD: {
      return state.update('gameId', () => action.game.gameId);
    }
  }
  return state;
}
