export const GAME_MOVE = 'GAME_MOVE';

export const actions = {
  move
};

export function move (engine, board, start, end, piece, promotion = null) {
  engine.move({from: start, to: end, promotion: promotion});
  return {
    type: GAME_MOVE,
    board: board,
    start: start,
    end: end,
    piece: piece,
    promotion: promotion
  };
}
