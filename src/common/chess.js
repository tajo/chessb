import {PIECES, COLORS} from './constants';
import {OrderedMap, Map} from 'immutable';

export function isMoveLegal(engineState, start, end) {
  return engineState.generatedMoves.some(move => move.to === end && move.from === start);
}

export function isPieceMovebale(engineState, position) {
  return engineState.generatedMoves.some(move => move.from === position);
}

export function isItMyGame(board, game, userId) {
  if (!game.startDate) return false;
  const color = getColor(game.getIn([board, 'engine']));
  if (game.getIn([board, color]) === userId) {
    return true;
  }
  return false;
}

export function getColor(engine) {
  if (engine.turn === 'w') {
    return COLORS.WHITE;
  }
  return COLORS.BLACK;
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

export function getFreePieces(engineState, color) {
  const freePieces = {};
  if (color === COLORS.WHITE) {
    [PIECES.QUEENW, PIECES.ROOKW, PIECES.KNIGHTW, PIECES.BISHOPW, PIECES.PAWNW].forEach(piece => {
      const count = engineState.whiteFreePieces.filter(_piece => _piece === translatePieceReverse(piece).type).length;
      if (count > 0) {
        freePieces[piece] = Map({count: count, type: piece});
      }
    });
  } else {
    [PIECES.QUEENB, PIECES.ROOKB, PIECES.KNIGHTB, PIECES.BISHOPB, PIECES.PAWNB].forEach(piece => {
      const count = engineState.blackFreePieces.filter(_piece => _piece === translatePieceReverse(piece).type).length;
      if (count > 0) {
        freePieces[piece] = Map({count: count, type: piece});
      }
    });
  }
  return OrderedMap(freePieces);
}

export function getPieces(board) {
  function getPiece(num, key) {
    return Map({position: key, type: board[num] ? translatePiece(board[num]) : null});
  }
  return OrderedMap({
    a8: getPiece(0, 'a8'),
    b8: getPiece(1, 'b8'),
    c8: getPiece(2, 'c8'),
    d8: getPiece(3, 'd8'),
    e8: getPiece(4, 'e8'),
    f8: getPiece(5, 'f8'),
    g8: getPiece(6, 'g8'),
    h8: getPiece(7, 'h8'),
    a7: getPiece(16, 'a7'),
    b7: getPiece(17, 'b7'),
    c7: getPiece(18, 'c7'),
    d7: getPiece(19, 'd7'),
    e7: getPiece(20, 'e7'),
    f7: getPiece(21, 'f7'),
    g7: getPiece(22, 'g7'),
    h7: getPiece(23, 'h7'),
    a6: getPiece(32, 'a6'),
    b6: getPiece(33, 'b6'),
    c6: getPiece(34, 'c6'),
    d6: getPiece(35, 'd6'),
    e6: getPiece(36, 'e6'),
    f6: getPiece(37, 'f6'),
    g6: getPiece(38, 'g6'),
    h6: getPiece(39, 'h6'),
    a5: getPiece(48, 'a5'),
    b5: getPiece(49, 'b5'),
    c5: getPiece(50, 'c5'),
    d5: getPiece(51, 'd5'),
    e5: getPiece(52, 'e5'),
    f5: getPiece(53, 'f5'),
    g5: getPiece(54, 'g5'),
    h5: getPiece(55, 'h5'),
    a4: getPiece(64, 'a4'),
    b4: getPiece(65, 'b4'),
    c4: getPiece(66, 'c4'),
    d4: getPiece(67, 'd4'),
    e4: getPiece(68, 'e4'),
    f4: getPiece(69, 'f4'),
    g4: getPiece(70, 'g4'),
    h4: getPiece(71, 'h4'),
    a3: getPiece(80, 'a3'),
    b3: getPiece(81, 'b3'),
    c3: getPiece(82, 'c3'),
    d3: getPiece(83, 'd3'),
    e3: getPiece(84, 'e3'),
    f3: getPiece(85, 'f3'),
    g3: getPiece(86, 'g3'),
    h3: getPiece(87, 'h3'),
    a2: getPiece(96, 'a2'),
    b2: getPiece(97, 'b2'),
    c2: getPiece(98, 'c2'),
    d2: getPiece(99, 'd2'),
    e2: getPiece(100, 'e2'),
    f2: getPiece(101, 'f2'),
    g2: getPiece(102, 'g2'),
    h2: getPiece(103, 'h2'),
    a1: getPiece(112, 'a1'),
    b1: getPiece(113, 'b1'),
    c1: getPiece(114, 'c1'),
    d1: getPiece(115, 'd1'),
    e1: getPiece(116, 'e1'),
    f1: getPiece(117, 'f1'),
    g1: getPiece(118, 'g1'),
    h1: getPiece(119, 'h1')
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
