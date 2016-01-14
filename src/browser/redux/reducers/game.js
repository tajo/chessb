import actions from '../../../common/actionConstants';
import {Record, List, Map} from 'immutable';
import {translatePieceReverse, getPieceColor} from '../../../common/chess';
import Chess from '../../../common/engine';
import {GAME_TIME} from '../../../common/constants';

const BoardState = Record({
  engine: null,
  promotion: false,
  moves: List(),
  dates: List(),
  squareSelected: null,
  WHITE: null,
  BLACK: null
});

const InitialState = Record({
  gameId: null,
  aBoard: new BoardState({engine: (new Chess()).getState()}),
  bBoard: new BoardState({engine: (new Chess()).getState()}),
  winner: null,
  startDate: null,
  gameTime: GAME_TIME
});

const initialState = new InitialState;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case actions.MOVE: {
      // move is coming from the server bc it has date
      if (action.date) {
        state = state.updateIn([action.board, 'dates'], dates => dates.push(action.date));
        // we originated this move, so we don't have to play it again
        if (state.getIn([action.board, 'moves']).count() === state.getIn([action.board, 'dates']).count()) {
          return state;
        }
      }

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

    case actions.SELECT_SQUARE: {
      if (action.position === null) {
        return state.updateIn([action.board, 'squareSelected'], () => null);
      }
      const selected = Map({position: action.position, piece: action.piece});
      return state.updateIn([action.board, 'squareSelected'], () => selected);
    }

    case actions.SHOW_PROMOTION_POPUP: {
      const prom = Map({from: action.start, to: action.end});
      return state.updateIn([action.board, 'promotion'], () => prom);
    }

    case actions.SERVER_SEAT_CHANGED: {
      return state
        .updateIn(['startDate'], () => action.startDate)
        .updateIn([action.board, action.color], () => action.userId);
    }

    case actions.SERVER_WINNER: {
      return state.updateIn(['winner'], () => Map(action.winner));
    }

    case actions.SERVER_SYNC_BOARD: {
      return new InitialState({
        gameId: action.game.gameId,
        aBoard: new BoardState({
          engine: action.game.aBoard.engine,
          promotion: false,
          moves: List(action.game.aBoard.moves),
          dates: List(action.game.aBoard.dates),
          squareSelected: null,
          WHITE: action.game.aBoard.WHITE,
          BLACK: action.game.aBoard.BLACK
        }),
        bBoard: new BoardState({
          engine: action.game.bBoard.engine,
          promotion: false,
          moves: List(action.game.bBoard.moves),
          dates: List(action.game.bBoard.dates),
          squareSelected: null,
          WHITE: action.game.bBoard.WHITE,
          BLACK: action.game.bBoard.BLACK
        }),
        winner: action.game.winner,
        startDate: action.game.startDate
      });
    }

  }
  return state;
}
