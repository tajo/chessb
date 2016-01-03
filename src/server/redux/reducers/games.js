import * as actions from '../actions/games';
import {Record, List, Map, OrderedMap} from 'immutable';
import {translatePieceReverse, getPieceColor} from '../../../common/chess';
import Chess from '../../../common/engine';
// import moment from 'moment';
import shortid from 'shortid';

const BoardState = Record({
  engine: null,
  moves: List(),
  dates: List(),
  white: null,
  black: null
});

const Game = Record({
  aBoard: new BoardState({engine: (new Chess()).getState()}),
  bBoard: new BoardState({engine: (new Chess()).getState()}),
  winner: null,
  startDate: null,
  endDate: null
});

const initialState = OrderedMap().set(shortid.generate, new Game);

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
  }
  return state;
}
