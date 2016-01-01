import * as actions from '../actions/users';
import {Map, Record} from 'immutable';

const UserRecord = Record({
  hashId: '',
  gameId: '',
  socketId: ''
});

const InitialState = Record({
  users: Map(),
  sockets: Map()
});

const initialState = new InitialState;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.USER_AUTHENTICATE: {
      return state
        .update('sockets', sockets => sockets.set(action.socketId, action.hashId))
        .update('users', users => users.set(action.hashId, new UserRecord({
          hashId: action.hashId,
          gameId: null,
          socketId: action.socketId
        })));
    }
    case actions.USER_DISCONNECT: {
      return state.update('sockets', sockets => sockets.delete(action.socketId));
    }
  }
  return state;
}
