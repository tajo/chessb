import {PIECES} from '../../../common/constants';
import actions from '../../../common/actionConstants';
import moment from 'moment';

export const actionCreators = {
  move,
  selectSquare,
  joinLeaveGame
};

export function move(board, start, end, piece, promotion = null) {
  if (promotion === null && piece === PIECES.PAWNW &&
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'].some(pos => pos === end)) {
    return {type: actions.GAME_SHOW_PROMOTION_POPUP, board: board, start: start, end: end};
  }
  if (promotion === null && piece === PIECES.PAWNB &&
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'].some(pos => pos === end)) {
    return {type: actions.GAME_SHOW_PROMOTION_POPUP, board: board, start: start, end: end};
  }

  const clickSound = new Audio('/assets/click.wav');
  clickSound.load();
  clickSound.play();
  return {
    type: actions.GAME_MOVE,
    board: board,
    start: start,
    end: end,
    piece: piece,
    promotion: promotion,
    date: moment().format()
  };
}

export function selectSquare(board, position, piece) {
  return {
    type: actions.GAME_SELECT_SQUARE,
    board: board,
    position: position,
    piece: piece
  };
}

export function joinLeaveGame(board, color, gameId) {
  return {
    type: actions.GAME_JOIN_LEAVE,
    board: board,
    color: color,
    gameId: gameId,
    remote: true
  };
}
