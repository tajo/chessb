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

export default function counterReducer (state = initialState, action) {
  switch (action.type) {
    case actions.COUNTER_INCREMENT: {
      return state.update('counter', counter => counter + 1);
    }

    case actions.COUNTER_DOUBLE_INCREMENT_SUCCESS: {
      return state.update('counter', counter => counter + 2);
    }
  }
  return state;
}
