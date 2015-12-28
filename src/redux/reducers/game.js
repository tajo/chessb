import * as actions from '../actions/game';
import {OrderedMap, Record, List, Map} from 'immutable';
import {freePieces, COLORS, PIECES} from '../../constants';
import {getNewBoard} from '../../lib/chess';
import Chess from '../../lib/engine';

const BoardState = Record({
  board: OrderedMap(getNewBoard()),
  engine: null,
  turn: COLORS.WHITE,
  promotion: false,
  moves: List(),
  squareSelected: false,
  freePieces: OrderedMap(freePieces)
});

const InitialState = Record({
  aBoard: new BoardState({engine: new Chess()}),
  bBoard: new BoardState({engine: new Chess()})
});

const initialState = new InitialState;

export default function gameReducer (state = initialState, action) {
  switch (action.type) {
    case actions.GAME_MOVE: {
      const move = Map({from: action.start, to: action.end, promotion: action.promotion});

      let capturedPiece = state.getIn([action.board, 'board', action.end]);
      // en passant capture
      if (action.result.flags === 'e') {
        const diff = action.piece === PIECES.PAWNW ? -1 : 1;
        const deleteSquare = action.end[0] + (parseInt(action.end[1], 10) + diff).toString();
        state = state.updateIn([action.board, 'board'], board => board.set(deleteSquare, null));
        capturedPiece = state.getIn([action.board, 'turn']) === COLORS.WHITE ? PIECES.PAWNB : PIECES.PAWNW;
      }

      // give the captured pieces to other board
      if (capturedPiece) {
        state = state.updateIn([
          action.board === 'aBoard' ? 'bBoard' : 'aBoard',
          'freePieces',
          capturedPiece
        ], count => {
          return count + 1;
        });
      }

      return state
        .updateIn([action.board, 'promotion'], promotion => false)
        .updateIn([action.board, 'turn'], turn => turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE)
        .updateIn([action.board, 'moves'], board => board.push(move))
        .updateIn([action.board, 'squareSelected'], square => false)
        .updateIn([action.board, 'board'], board => {
          return board
            .set(action.start, null)
            .set(action.end, action.piece);
        });
    }

    case actions.GAME_SELECT_SQUARE: {
      return state.updateIn([action.board, 'squareSelected'], sqaure => action.position);
    }

    case actions.GAME_SHOW_PROMOTION_POPUP: {
      const prom = Map({from: action.start, to: action.end});
      return state.updateIn([action.board, 'promotion'], promotion => prom);
    }
  }
  return state;
}
