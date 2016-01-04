import * as actions from './actions';
import {Record, List, Map, OrderedMap} from 'immutable';
// import {translatePieceReverse, getPieceColor} from '../../common/chess';
import Chess from '../../common/engine';
import shortid from 'shortid';

const BoardState = Record({
  engine: null,
  moves: List(),
  dates: List(),
  white: null,
  black: null
});

const Game = Record({
  gameId: null,
  aBoard: new BoardState({engine: (new Chess()).getState()}),
  bBoard: new BoardState({engine: (new Chess()).getState()}),
  winner: null,
  startDate: null,
  endDate: null
});

const UserRecord = Record({
  hashId: '',
  gameId: '',
  socketId: ''
});

const firstGameId = shortid.generate();
const InitialState = Record({
  users: Map(),
  sockets: Map(),
  games: OrderedMap().set(firstGameId, new Game({gameId: firstGameId}))
});

const initialState = new InitialState;

export default function reducer(state = initialState, action) {
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
    case actions.GAMES_FIND_SEAT: {
      console.log('hola');
      const freeSeatBoards = state.get('games').filter(game => {
        return !game.getIn(['aBoard', 'white']) ||
               !game.getIn(['aBoard', 'black']) ||
               !game.getIn(['bBoard', 'white']) ||
               !game.getIn(['bBoard', 'black']);
      });
      if (freeSeatBoards.first()) {
        return state.updateIn(['users', action.userId, 'gameId'], () => {
          return freeSeatBoards.first().get('gameId');
        });
      }
      const newGameId = shortid.generate();
      return state
        .updateIn(['users', action.userId, 'gameId'], () => newGameId)
        .update('games', games => games.set(newGameId, new Game({gameId: newGameId})));
    }
  }
  return state;
}
