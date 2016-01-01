import {PIECES, COLORS} from '../constants';
import Chess from '../../common/engine';
import {OrderedMap} from 'immutable';

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

export function getPieces(board) {
  function getPiece(num) {
    return board[num] ? translatePiece(board[num]) : null;
  }
  return OrderedMap({
    a8: getPiece(0),
    b8: getPiece(1),
    c8: getPiece(2),
    d8: getPiece(3),
    e8: getPiece(4),
    f8: getPiece(5),
    g8: getPiece(6),
    h8: getPiece(7),
    a7: getPiece(16),
    b7: getPiece(17),
    c7: getPiece(18),
    d7: getPiece(19),
    e7: getPiece(20),
    f7: getPiece(21),
    g7: getPiece(22),
    h7: getPiece(23),
    a6: getPiece(32),
    b6: getPiece(33),
    c6: getPiece(34),
    d6: getPiece(35),
    e6: getPiece(36),
    f6: getPiece(37),
    g6: getPiece(38),
    h6: getPiece(39),
    a5: getPiece(48),
    b5: getPiece(49),
    c5: getPiece(50),
    d5: getPiece(51),
    e5: getPiece(52),
    f5: getPiece(53),
    g5: getPiece(54),
    h5: getPiece(55),
    a4: getPiece(64),
    b4: getPiece(65),
    c4: getPiece(66),
    d4: getPiece(67),
    e4: getPiece(68),
    f4: getPiece(69),
    g4: getPiece(70),
    h4: getPiece(71),
    a3: getPiece(80),
    b3: getPiece(81),
    c3: getPiece(82),
    d3: getPiece(83),
    e3: getPiece(84),
    f3: getPiece(85),
    g3: getPiece(86),
    h3: getPiece(87),
    a2: getPiece(96),
    b2: getPiece(97),
    c2: getPiece(98),
    d2: getPiece(99),
    e2: getPiece(100),
    f2: getPiece(101),
    g2: getPiece(102),
    h2: getPiece(103),
    a1: getPiece(112),
    b1: getPiece(113),
    c1: getPiece(114),
    d1: getPiece(115),
    e1: getPiece(116),
    f1: getPiece(117),
    g1: getPiece(118),
    h1: getPiece(119)
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
