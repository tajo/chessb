import * as actions from '../actions/game';
import {OrderedMap, Record, List, Map} from 'immutable';
import {freePieces, COLORS, PIECES, startingBoard} from '../../constants';
import {translatePieceReverse, getPieceColor} from '../../lib/chess';
import Chess from '../../../common/engine';
import moment from 'moment';

const BoardState = Record({
  board: OrderedMap(startingBoard),
  engine: null,
  turn: COLORS.WHITE,
  promotion: false,
  moves: List(),
  dates: List(),
  squareSelected: null,
  freePieces: OrderedMap(freePieces)
});

const InitialState = Record({
  aBoard: new BoardState({engine: (new Chess()).getState()}),
  bBoard: new BoardState({engine: (new Chess()).getState()}),
  winner: null,
  startDate: moment().format(),
  endDate: moment().add('194', 's').format()
});

const initialState = new InitialState;


export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GAME_MOVE: {
      state = state.updateIn([action.board, 'dates'], dates => dates.push(action.date));
      const move = Map({from: action.start, to: action.end, promotion: action.promotion});

      // update engine state
      const engine = new Chess(state.getIn([action.board, 'engine']));
      engine.move({from: action.start, to: action.end, promotion: action.promotion});
      state = state.updateIn([action.board, 'engine'], () => engine.getState());

      const capturedPiece = state.getIn([action.board, 'board', action.end]);

      // give the captured pieces to other board
      if (capturedPiece) {
        const translated = translatePieceReverse(capturedPiece);
        const engine = new Chess(state.getIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine']));
        engine.addFreePiece(translated.color, translated.type);
        state = state.updateIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine'], () => engine.getState());
        state = state.updateIn([
          action.board === 'aBoard' ? 'bBoard' : 'aBoard',
          'freePieces',
          capturedPiece
        ], count => {
          return count + 1;
        });
      }

      // drop piece
      if (['p', 'r', 'q', 'n', 'b'].some(p => p === action.start)) {
        state = state.updateIn([action.board, 'freePieces', action.piece], counter => counter - 1);
        const engine = new Chess(state.getIn([action.board, 'engine']));
        engine.removeFreePiece(translatePieceReverse(action.piece).color, action.start);
        state = state.updateIn([action.board, 'engine'], () => engine.getState());
      }

      // end of game
      if (engine.game_over()) {
        state = state.updateIn(['winner'], () => Map({board: action.board, color: getPieceColor(action.piece)}));
      }

      return state
        .updateIn([action.board, 'promotion'], () => false)
        .updateIn([action.board, 'turn'], turn => turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE)
        .updateIn([action.board, 'moves'], board => board.push(move))
        .updateIn([action.board, 'squareSelected'], () => null)
        .updateIn([action.board, 'board'], board => {
          if (['p', 'r', 'q', 'n', 'b'].some(p => p === action.start)) {
            return board.set(action.end, action.piece);
          }
          return board
            .set(action.start, null)
            .set(action.end, action.piece);
        });
    }

    case actions.GAME_SELECT_SQUARE: {
      if (action.position === null) {
        return state.updateIn([action.board, 'squareSelected'], () => null);
      }
      const selected = Map({position: action.position, piece: action.piece});
      return state.updateIn([action.board, 'squareSelected'], () => selected);
    }

    case actions.GAME_SHOW_PROMOTION_POPUP: {
      const prom = Map({from: action.start, to: action.end});
      return state.updateIn([action.board, 'promotion'], () => prom);
    }
  }
  return state;
}
