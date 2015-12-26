export const GAME_MOVE = 'GAME_MOVE';

export const actions = {
  move
};

export function move (board, start, end, piece, promotion = null) {
  return {
    type: GAME_MOVE,
    board: board,
    start: start,
    end: end,
    piece: piece,
    promotion: promotion
  };
}
