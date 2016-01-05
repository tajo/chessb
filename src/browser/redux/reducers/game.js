import * as actions from '../actions/game';
import {Record, List, Map} from 'immutable';
import {translatePieceReverse, getPieceColor} from '../../../common/chess';
import Chess from '../../../common/engine';
import moment from 'moment';

const BoardState = Record({
  engine: null,
  promotion: false,
  moves: List(),
  dates: List(),
  squareSelected: null
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

      const engine = new Chess(state.getIn([action.board, 'engine']));

      // give the captured pieces to other board
      if (engine.get(action.end)) {
        const engineOther = new Chess(state.getIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine']));
        engineOther.addFreePiece(engine.get(action.end));
        engineOther.preLoadMoves();
        state = state.updateIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine'], () => engineOther.getState());
      }

      // make move
      engine.move({from: action.start, to: action.end, promotion: action.promotion});

      // drop piece
      if (['p', 'r', 'q', 'n', 'b'].some(p => p === action.start)) {
        engine.removeFreePiece(translatePieceReverse(action.piece).color, action.start);
      }

      // end of game
      if (engine.game_over()) {
        state = state.updateIn(['winner'], () => Map({board: action.board, color: getPieceColor(action.piece)}));
      }

      return state
        .updateIn([action.board, 'promotion'], () => false)
        .updateIn([action.board, 'moves'], board => board.push(Map({from: action.start, to: action.end, promotion: action.promotion})))
        .updateIn([action.board, 'squareSelected'], () => null)
        .updateIn([action.board, 'engine'], () => engine.getState());
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
