import actions from '../../common/actionConstants';
import {Record, List, Map, OrderedMap} from 'immutable';
import Chess from '../../common/engine';
import {translatePieceReverse, getPieceColor} from '../../common/chess';
import shortid from 'shortid';
import {COLORS, GAME_TIME, GAME_DELAY} from '../../common/constants';
import moment from 'moment';

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
  gameTime: GAME_TIME
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

    case actions.SERVER_USER_DISCONNECT: {
      return state.update('sockets', sockets => sockets.delete(action.socketId));
    }

    case actions.SERVER_FIND_SEAT: {
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

    case actions.JOIN_LEAVE_GAME: {
      const checkA = state.getIn(['games', action.gameId, action.board === 'bBoard' ? 'aBoard' : 'bBoard', action.color]);
      const checkB = state.getIn(['games', action.gameId, action.board, action.color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK]);
      if (checkA !== action.userId && checkB !== action.userId) {
        state = state.updateIn(['games', action.gameId, action.board, action.color], (userId) => {
          if (!userId) return action.userId;
          if (userId === action.userId) return null;
          return userId;
        });
      }

      // if game is full start it!
      const aBoardWhite = state.getIn(['games', action.gameId, 'aBoard', COLORS.WHITE]);
      const aBoardBlack = state.getIn(['games', action.gameId, 'aBoard', COLORS.BLACK]);
      const bBoardWhite = state.getIn(['games', action.gameId, 'bBoard', COLORS.WHITE]);
      const bBoardBlack = state.getIn(['games', action.gameId, 'bBoard', COLORS.BLACK]);
      const startDate = state.getIn(['games', action.gameId, 'startDate']);

      if (aBoardWhite && aBoardBlack && bBoardWhite && bBoardBlack) {
        if (!startDate) {
          state = state.updateIn(['games', action.gameId, 'startDate'], () => moment().add(GAME_DELAY, 'ms').format());
        }
      } else {
        if (startDate && moment(startDate).diff(moment()) > 0) {
          state = state.updateIn(['games', action.gameId, 'startDate'], () => null);
        }
      }
      return state;
    }

    case actions.MOVE: {
      if (action.room) return state;
      const engine = new Chess(state.getIn(['games', action.gameId, action.board, 'engine']));

      // give the captured pieces to other board
      const endPiece = engine.get(action.end);

      // make move
      const result = engine.move({from: action.start, to: action.end, promotion: action.promotion});
      if (!result) return state;

      state = state.updateIn(['games', action.gameId, action.board, 'dates'], dates => dates.push(action.date));

      if (endPiece) {
        const engineOther = new Chess(state.getIn(['games', action.gameId, action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine']));
        engineOther.addFreePiece(endPiece);
        engineOther.preLoadMoves();
        state = state.updateIn(['games', action.gameId, action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine'], () => engineOther.getState());
      }

      // drop piece
      if (['p', 'r', 'q', 'n', 'b'].some(p => p === action.start)) {
        engine.removeFreePiece(translatePieceReverse(action.piece).color, action.start);
      }

      // end of game
      if (engine.game_over()) {
        state = state.updateIn(['games', action.gameId, 'winner'], () => Map({board: action.board, color: getPieceColor(action.piece)}));
      }

      return state
        .updateIn(['games', action.gameId, action.board, 'moves'], board => board.push(Map({from: action.start, to: action.end, promotion: action.promotion})))
        .updateIn(['games', action.gameId, action.board, 'engine'], () => engine.getState());
    }

  }
  return state;
}
