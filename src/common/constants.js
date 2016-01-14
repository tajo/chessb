// export const GAME_TIME = 194000;
export const GAME_TIME = 21000;
export const GAME_DELAY = 2000;

export const COLORS = {
  BLACK: 'BLACK',
  WHITE: 'WHITE'
};

export const PIECES = {
  BISHOPB: 'BISHOPB',
  BISHOPW: 'BISHOPW',
  KINGB: 'KINGB',
  KINGW: 'KINGW',
  KNIGHTB: 'KNIGHTB',
  KNIGHTW: 'KNIGHTW',
  PAWNB: 'PAWNB',
  PAWNW: 'PAWNW',
  QUEENB: 'QUEENB',
  QUEENW: 'QUEENW',
  ROOKB: 'ROOKB',
  ROOKW: 'ROOKW'
};

export const board = {
  a8: null,
  b8: null,
  c8: null,
  d8: null,
  e8: null,
  f8: null,
  g8: null,
  h8: null,
  a7: null,
  b7: null,
  c7: null,
  d7: null,
  e7: null,
  f7: null,
  g7: null,
  h7: null,
  a6: null,
  b6: null,
  c6: null,
  d6: null,
  e6: null,
  f6: null,
  g6: null,
  h6: null,
  a5: null,
  b5: null,
  c5: null,
  d5: null,
  e5: null,
  f5: null,
  g5: null,
  h5: null,
  a4: null,
  b4: null,
  c4: null,
  d4: null,
  e4: null,
  f4: null,
  g4: null,
  h4: null,
  a3: null,
  b3: null,
  c3: null,
  d3: null,
  e3: null,
  f3: null,
  g3: null,
  h3: null,
  a2: null,
  b2: null,
  c2: null,
  d2: null,
  e2: null,
  f2: null,
  g2: null,
  h2: null,
  a1: null,
  b1: null,
  c1: null,
  d1: null,
  e1: null,
  f1: null,
  g1: null,
  h1: null
};

export const squareColors = {
  a8: COLORS.WHITE,
  b8: COLORS.BLACK,
  c8: COLORS.WHITE,
  d8: COLORS.BLACK,
  e8: COLORS.WHITE,
  f8: COLORS.BLACK,
  g8: COLORS.WHITE,
  h8: COLORS.BLACK,
  a7: COLORS.BLACK,
  b7: COLORS.WHITE,
  c7: COLORS.BLACK,
  d7: COLORS.WHITE,
  e7: COLORS.BLACK,
  f7: COLORS.WHITE,
  g7: COLORS.BLACK,
  h7: COLORS.WHITE,
  a6: COLORS.WHITE,
  b6: COLORS.BLACK,
  c6: COLORS.WHITE,
  d6: COLORS.BLACK,
  e6: COLORS.WHITE,
  f6: COLORS.BLACK,
  g6: COLORS.WHITE,
  h6: COLORS.BLACK,
  a5: COLORS.BLACK,
  b5: COLORS.WHITE,
  c5: COLORS.BLACK,
  d5: COLORS.WHITE,
  e5: COLORS.BLACK,
  f5: COLORS.WHITE,
  g5: COLORS.BLACK,
  h5: COLORS.WHITE,
  a4: COLORS.WHITE,
  b4: COLORS.BLACK,
  c4: COLORS.WHITE,
  d4: COLORS.BLACK,
  e4: COLORS.WHITE,
  f4: COLORS.BLACK,
  g4: COLORS.WHITE,
  h4: COLORS.BLACK,
  a3: COLORS.BLACK,
  b3: COLORS.WHITE,
  c3: COLORS.BLACK,
  d3: COLORS.WHITE,
  e3: COLORS.BLACK,
  f3: COLORS.WHITE,
  g3: COLORS.BLACK,
  h3: COLORS.WHITE,
  a2: COLORS.WHITE,
  b2: COLORS.BLACK,
  c2: COLORS.WHITE,
  d2: COLORS.BLACK,
  e2: COLORS.WHITE,
  f2: COLORS.BLACK,
  g2: COLORS.WHITE,
  h2: COLORS.BLACK,
  a1: COLORS.BLACK,
  b1: COLORS.WHITE,
  c1: COLORS.BLACK,
  d1: COLORS.WHITE,
  e1: COLORS.BLACK,
  f1: COLORS.WHITE,
  g1: COLORS.BLACK,
  h1: COLORS.WHITE
};

export function getSquareColor(square) {
  return squareColors[square];
}

export const startingBoard = {
  a8: PIECES.ROOKB,
  b8: PIECES.KNIGHTB,
  c8: PIECES.BISHOPB,
  d8: PIECES.QUEENB,
  e8: PIECES.KINGB,
  f8: PIECES.BISHOPB,
  g8: PIECES.KNIGHTB,
  h8: PIECES.ROOKB,
  a7: PIECES.PAWNB,
  b7: PIECES.PAWNB,
  c7: PIECES.PAWNB,
  d7: PIECES.PAWNB,
  e7: PIECES.PAWNB,
  f7: PIECES.PAWNB,
  g7: PIECES.PAWNB,
  h7: PIECES.PAWNB,
  a6: null,
  b6: null,
  c6: null,
  d6: null,
  e6: null,
  f6: null,
  g6: null,
  h6: null,
  a5: null,
  b5: null,
  c5: null,
  d5: null,
  e5: null,
  f5: null,
  g5: null,
  h5: null,
  a4: null,
  b4: null,
  c4: null,
  d4: null,
  e4: null,
  f4: null,
  g4: null,
  h4: null,
  a3: null,
  b3: null,
  c3: null,
  d3: null,
  e3: null,
  f3: null,
  g3: null,
  h3: null,
  a2: PIECES.PAWNW,
  b2: PIECES.PAWNW,
  c2: PIECES.PAWNW,
  d2: PIECES.PAWNW,
  e2: PIECES.PAWNW,
  f2: PIECES.PAWNW,
  g2: PIECES.PAWNW,
  h2: PIECES.PAWNW,
  a1: PIECES.ROOKW,
  b1: PIECES.KNIGHTW,
  c1: PIECES.BISHOPW,
  d1: PIECES.QUEENW,
  e1: PIECES.KINGW,
  f1: PIECES.BISHOPW,
  g1: PIECES.KNIGHTW,
  h1: PIECES.ROOKW
};
