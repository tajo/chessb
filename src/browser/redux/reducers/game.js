import actions from '../../../common/actionConstants';
import {Record, List, Map} from 'immutable';
import {translatePieceReverse, getPieceColor, getSquareNum} from '../../../common/chess';
import Chess from '../../../common/engine';
import {COLORS} from '../../../common/constants';

const BoardState = Record({
  engine: null,
  promotion: false,
  moves: List(),
  dates: List(),
  squareSelected: null,
  WHITE: null,
  BLACK: null
});

const MessageState = Record({
  userId: null,
  text: ''
});

const InitialState = Record({
  gameId: null,
  aBoard: new BoardState({engine: (new Chess()).getState()}),
  bBoard: new BoardState({engine: (new Chess()).getState()}),
  winner: null,
  startDate: null,
  gameTime: null,
  chat: List()
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
      const endPiece = engine.get(action.end);

      // make the move
      const promoted = state.getIn([action.board, 'engine']).promoted.slice(0);
      const result = engine.move({from: action.start, to: action.end, promotion: action.promotion});

      if (endPiece || result.flags === 'e') {
        const engineOther = new Chess(state.getIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine']));
        if (endPiece) {
          if (promoted.indexOf(getSquareNum(action.end)) > -1) {
            engineOther.addFreePiece({
              color: getPieceColor(action.piece) === COLORS.WHITE ? 'b' : 'w',
              type: 'p'
            });
          } else {
            engineOther.addFreePiece(endPiece);
          }
        } else {
          engineOther.addFreePiece({
            color: getPieceColor(action.piece) === COLORS.WHITE ? 'b' : 'w',
            type: 'p'
          });
        }
        engineOther.preLoadMoves();
        state = state.updateIn([action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine'], () => engineOther.getState());
      }

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
        winner: action.game.winner ? Map(action.game.winner) : null,
        startDate: action.game.startDate,
        gameTime: action.game.gameTime,
        chat: List(action.game.chat),
      });
    }

    case actions.SERVER_SEND_CHAT: {
      return state.updateIn(['chat'], chat => {
        return chat.push(new MessageState({userId: action.userId, text: action.text}));
      });
    }

  }
  return state;
}
