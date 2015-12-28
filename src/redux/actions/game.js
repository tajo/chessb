import {PIECES} from '../../constants';
import click from '../../assets/click.wav';

export const GAME_MOVE = 'GAME_MOVE';
export const GAME_SELECT_SQUARE = 'GAME_SELECT_SQUARE';
export const GAME_SHOW_PROMOTION_POPUP = 'GAME_SHOW_PROMOTION_POPUP';

export const actions = {
  move,
  selectSquare
};

export function move (engine, board, start, end, piece, promotion = null) {
  if (promotion === null && piece === PIECES.PAWNW &&
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'].some(pos => pos === end)) {
    return {type: GAME_SHOW_PROMOTION_POPUP, board: board, start: start, end: end};
  }
  if (promotion === null && piece === PIECES.PAWNB &&
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'].some(pos => pos === end)) {
    return {type: GAME_SHOW_PROMOTION_POPUP, board: board, start: start, end: end};
  }
  const result = engine.move({from: start, to: end, promotion: promotion});
  console.log(`Game over: ${engine.game_over()}, Check mate: ${engine.in_checkmate()}`);
  const clickSound = new Audio(click);
  clickSound.load();
  clickSound.play();
  return {
    type: GAME_MOVE,
    board: board,
    start: start,
    end: end,
    piece: piece,
    result: result
  };
}

export function selectSquare (board, position, piece) {
  return {
    type: GAME_SELECT_SQUARE,
    board: board,
    position: position,
    piece: piece
  };
}
