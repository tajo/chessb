import Chess from 'chess.js';
// import {OrderedMap, Record} from 'immutable';
import {board, PIECES} from '../constants';

export function getNewGame () {
  const game = new Chess();
  let newBoard = {};
  for (let square in board) {
    newBoard[square] = translatePiece(game.get(square));
  }
  return newBoard;
}

export function getMoveResult (moves, start, end, promotion = null) {
  const game = new Chess();
  moves.forEach((move) => game.move(move.toJS()));
  return game.move({from: start, to: end, promotion: promotion});
}

function translatePiece (piece) {
  if (!piece) return null;
  if (piece.type === 'p' && piece.color === 'b') return PIECES.PAWNB;
  if (piece.type === 'p' && piece.color === 'w') return PIECES.PAWNW;
  if (piece.type === 'k' && piece.color === 'b') return PIECES.KINGB;
  if (piece.type === 'k' && piece.color === 'w') return PIECES.KINGW;
  if (piece.type === 'q' && piece.color === 'b') return PIECES.QUEENB;
  if (piece.type === 'q' && piece.color === 'w') return PIECES.QUEENW;
  if (piece.type === 'b' && piece.color === 'b') return PIECES.BISHOPB;
  if (piece.type === 'b' && piece.color === 'w') return PIECES.BISHOPW;
  if (piece.type === 'n' && piece.color === 'b') return PIECES.KNIGHTB;
  if (piece.type === 'n' && piece.color === 'w') return PIECES.KNIGHTW;
  if (piece.type === 'r' && piece.color === 'b') return PIECES.ROOKB;
  if (piece.type === 'r' && piece.color === 'w') return PIECES.ROOKW;
  return null;
}

function translatePieceReverse (piece) {
  if (piece === PIECES.PAWNB) return {type: 'p', color: 'b'};
  if (piece === PIECES.PAWNW) return {type: 'p', color: 'w'};
  if (piece === PIECES.KINGB) return {type: 'k', color: 'b'};
  if (piece === PIECES.KINGW) return {type: 'k', color: 'w'};
  if (piece === PIECES.QUEENB) return {type: 'q', color: 'b'};
  if (piece === PIECES.QUEENW) return {type: 'q', color: 'w'};
  if (piece === PIECES.BISHOPB) return {type: 'b', color: 'b'};
  if (piece === PIECES.BISHOPW) return {type: 'b', color: 'w'};
  if (piece === PIECES.KNIGHTB) return {type: 'n', color: 'b'};
  if (piece === PIECES.KNIGHTW) return {type: 'n', color: 'w'};
  if (piece === PIECES.ROOKB) return {type: 'r', color: 'b'};
  if (piece === PIECES.ROOKW) return {type: 'r', color: 'w'};
  return null;
}
