import actions from '../../common/actionConstants';
import {Record, List, Map, OrderedMap} from 'immutable';
// import {translatePieceReverse, getPieceColor} from '../../common/chess';
import Chess from '../../common/engine';
import shortid from 'shortid';
import {COLORS} from '../../common/constants';

const BoardState = Record({
  engine: null,
  moves: List(),
  dates: List(),
  WHITE: null,
  BLACK: null
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
      console.log('auth called');
      return state
        .update('sockets', sockets => sockets.set(action.socketId, action.hashId))
        .update('users', users => users.set(action.hashId, new UserRecord({
          hashId: action.hashId,
          gameId: null,
          socketId: action.socketId
        })));
    }

    case actions.SERVER_USER_DISCONNECT: {
      return state.update('sockets', sockets => sockets.delete(action.socketId));
    }

    case actions.SERVER_GAMES_FIND_SEAT: {
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

    case actions.GAME_JOIN_LEAVE: {
      const checkA = state.getIn(['games', action.gameId, action.board === 'bBoard' ? 'aBoard' : 'bBoard', action.color]);
      const checkB = state.getIn(['games', action.gameId, action.board, action.color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK]);
      if (checkA !== action.userId && checkB !== action.userId) {
        return state.updateIn(['games', action.gameId, action.board, action.color], (userId) => {
          if (!userId) return action.userId;
          if (userId === action.userId) return null;
          return userId;
        });
      }
    }
  }
  return state;
}
