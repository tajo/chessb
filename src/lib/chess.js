import Chess from './engine';
// import {OrderedMap, Record} from 'immutable';
import {board, PIECES, COLORS} from '../constants';

export function getNewBoard () {
  const game = new Chess();
  let newBoard = {};
  for (let square in board) {
    newBoard[square] = translatePiece(game.get(square));
  }
  return newBoard;
}

export function makeMove (engine, start, end, promotion = null) {
  console.log(engine.move({from: start, to: end, promotion: promotion}));
}

export function isMoveLegal (engine, start, end, promotion = null) {
  const moves = engine.moves({square: start, verbose: true});
  return moves.some(move => move.to === end);
}

export function isPieceMovebale (engine, position) {
  return engine.moves({square: position}).length > 0;
}

export function filterFreePieces (freePieces, color) {
  return freePieces.filter((count, piece) => {
    if (count === 0) return false;
    if (color === COLORS.WHITE &&
      [PIECES.PAWNB, PIECES.ROOKB, PIECES.KNIGHTB, PIECES.BISHOPB, PIECES.QUEENB].some(p => p === piece)) return false;
    if (color === COLORS.BLACK &&
      [PIECES.PAWNW, PIECES.ROOKW, PIECES.KNIGHTW, PIECES.BISHOPW, PIECES.QUEENW].some(p => p === piece)) return false;
    return true;
  });
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

export function translatePieceReverse (piece) {
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

