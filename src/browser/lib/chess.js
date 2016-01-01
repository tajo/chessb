import {PIECES, COLORS} from '../constants';
import Chess from '../../common/engine';

export function isMoveLegal(engineState, start, end) {
  const engine = new Chess(engineState);
  return engine.moves().some(move => move.to === end && move.from === start);
}

export function isPieceMovebale(engineState, position) {
  const engine = new Chess(engineState);
  return engine.moves().some(move => move.from === position);
}

export function filterFreePieces(freePieces, color) {
  return freePieces.filter((count, piece) => {
    if (count === 0) return false;
    if (color === COLORS.WHITE &&
      [PIECES.PAWNB, PIECES.ROOKB, PIECES.KNIGHTB, PIECES.BISHOPB, PIECES.QUEENB].some(p => p === piece)) return false;
    if (color === COLORS.BLACK &&
      [PIECES.PAWNW, PIECES.ROOKW, PIECES.KNIGHTW, PIECES.BISHOPW, PIECES.QUEENW].some(p => p === piece)) return false;
    return true;
  });
}

export function getPieceColor(piece) {
  return translatePieceReverse(piece).color === 'w' ? COLORS.WHITE : COLORS.BLACK;
}

export function translatePiece(piece) {
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

export function translatePieceReverse(piece) {
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
