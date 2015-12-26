export const GAME_MOVE = 'GAME_MOVE';
export const GAME_SELECT_SQUARE = 'GAME_SELECT_SQUARE';

export const actions = {
  move,
  selectSquare
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

export function selectSquare (board, position) {
  return {
    type: GAME_SELECT_SQUARE,
    board: board,
    position: position
  };
}
