import * as actions from '../actions/game';
import {OrderedMap, Record} from 'immutable';
import {board, freePieces} from '../../constants';
import {getNewGame} from '../../lib/chess';

const InitialState = Record({
  aBoard: OrderedMap(getNewGame()),
  aBoardWhitePieces: OrderedMap(freePieces),
  aBoardBlackPieces: OrderedMap(freePieces),
  bBoard: OrderedMap(board),
  bBoardWhitePieces: OrderedMap(freePieces),
  bBoardBlackPieces: OrderedMap(freePieces)
});

const initialState = new InitialState;

export default function gameReducer (state = initialState, action) {
  switch (action.type) {
    case actions.GAME_MOVE: {
      return state
        .update(action.board, _board => _board.set(action.start, null))
        .update(action.board, _board => _board.set(action.end, action.piece));
    }
  }
  return state;
}
