import * as actions from '../actions/game';
import {OrderedMap, Record, List, Map} from 'immutable';
import {freePieces} from '../../constants';
import {getNewGame} from '../../lib/chess';

const BoardState = Record({
  board: OrderedMap(getNewGame()),
  moves: List(),
  whitePieces: OrderedMap(freePieces),
  blackPieces: OrderedMap(freePieces)
});

const InitialState = Record({
  aBoard: new BoardState,
  bBoard: new BoardState
});

const initialState = new InitialState;

export default function gameReducer (state = initialState, action) {
  switch (action.type) {
    case actions.GAME_MOVE: {
      const move = Map({from: action.start, to: action.end, promotion: action.promotion});
      return state
        .updateIn([action.board, 'moves'], board => board.push(move))
        .updateIn([action.board, 'board'], board => {
          return board
            .set(action.start, null)
            .set(action.end, action.piece);
        });
    }
  }
  return state;
}
