import {getMoveResult} from '../../lib/chess';

export const GAME_MOVE = 'GAME_MOVE';

export const actions = {
  move
};

export function move (board, start, end, piece) {
  console.log(getMoveResult(board, start, end));
  return {
    type: GAME_MOVE,
    start: start,
    end: end,
    piece: piece
  };
}
