/* eslint-disable */

// ORIGINAL SOURCE
/* @license
 * Copyright (c) 2015, Jeff Hlywa (jhlywa@gmail.com)
 * Released under the BSD license
 * https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

/* HEAVILY MODIFIED (50% of code deleted + many other adaptions to
 * reflect significant differences between Chess and Bughouse Chess
 * modified by Vojtech Miksu <vojtech@miksu.cz>, 2016 */

export default function Chess(newstate) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
    DROP: 'd'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var FREE_SQUARES = {
    q: 'q',
    n: 'n',
    r: 'r',
    b: 'b',
    p: 'p'
  }

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
  };

  var history = [];
  var generatedMoves = [];
  if (typeof newstate !== 'undefined') {
    var promoted = newstate.promoted;
    var board = newstate.board;
    var kings = newstate.kings;
    var turn = newstate.turn;
    var castling = newstate.castling;
    var ep_square = newstate.ep_square;
    var blackFreePieces = newstate.blackFreePieces;
    var whiteFreePieces = newstate.whiteFreePieces;
  } else {
    var promoted = [];
    var board = [{"type":"r","color":"b"},{"type":"n","color":"b"},{"type":"b","color":"b"},{"type":"q","color":"b"},{"type":"k","color":"b"},{"type":"b","color":"b"},{"type":"n","color":"b"},{"type":"r","color":"b"},null,null,null,null,null,null,null,null,{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},null,null,null,null,null,null,null,null,{"type":"r","color":"w"},{"type":"n","color":"w"},{"type":"b","color":"w"},{"type":"q","color":"w"},{"type":"k","color":"w"},{"type":"b","color":"w"},{"type":"n","color":"w"},{"type":"r","color":"w"},null,null,null,null,null,null,null,null];
    var kings = {w: 116, b: 4};
    var turn = WHITE;
    var castling = {w: 96, b: 96};
    var ep_square = EMPTY;
    var blackFreePieces = [];
    var whiteFreePieces = [];
  }
  preGenerateMoves();

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color} : null;
  }

  function put(piece, square) {
    var sq = SQUARES[square];
    board[sq] = {type: piece.type, color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }
    return true;
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
          }
      } else {
       moves.push(build_move(board, from, to, flags));
      }
    }

    function addFreePieceMoves(board, color) {
      var freePieces = (color === WHITE) ? whiteFreePieces : blackFreePieces;
      freePieces.forEach(freePiece => {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) { i += 7; continue; }
          var piece = board[i];
          if (piece != null) { continue; }
          if (freePiece === PAWN && (rank(i) === RANK_8 || rank(i) === RANK_1)) { continue; }
          moves.push({
            color: color,
            from: freePiece,
            to: i,
            flags: FLAGS.DROP,
            piece: freePiece
          });
        }
      });
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2};

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    addFreePieceMoves(board, us);

    /* king-side castling */
    if (castling[us] & BITS.KSIDE_CASTLE) {
      var castling_from = kings[us];
      var castling_to = castling_from + 2;
      if (board[castling_from + 1] == null &&
          board[castling_to]       == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from + 1) &&
          !attacked(them, castling_to)) {
        add_move(board, moves, kings[us] , castling_to,
                 BITS.KSIDE_CASTLE);
      }
    }

    /* queen-side castling */
    if (castling[us] & BITS.QSIDE_CASTLE) {
      var castling_from = kings[us];
      var castling_to = castling_from - 2;

      if (board[castling_from - 1] == null &&
          board[castling_from - 2] == null &&
          board[castling_from - 3] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from - 1) &&
          !attacked(them, castling_to)) {
        add_move(board, moves, kings[us], castling_to,
                 BITS.QSIDE_CASTLE);
      }
    }


    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves;
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    if (!in_check()) return false;
    if (generatedMoves.length !== 0) return false;
    var freePieces = whiteFreePieces;
    if (turn === BLACK) freePieces = blackFreePieces;
    freePieces.push('b');
    preGenerateMoves();
    freePieces.pop();
    if (generatedMoves.length === 0) {
      preGenerateMoves();
      return true;
    }
    preGenerateMoves();
    return false;
  }

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w},
      turn: turn,
      castling: {b: castling.b, w: castling.w},
      ep_square: ep_square
    });
  }

  function isDropMove(position) {
    return ['q', 'r', 'n', 'b', 'p'].some(piece => piece === position)
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    if (isDropMove(move.from)) {
      board[move.to] = {color: move.color, type: move.piece};
    } else {
      board[move.to] = board[move.from];
      board[move.from] = null;
    }

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us};
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us] && !isDropMove(move.from)) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;

    var us = turn;
    var them = swap_color(turn);

    if (!isDropMove(move.from)) {
      board[move.from] = board[move.to];
      board[move.from].type = move.piece;  // to undo any promotions
    }
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them};
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = {type: PAWN, color: them};
    }


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move;
  }

  function preGenerateMoves() {
    generatedMoves = generate_moves({verbose: 'true'});
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(i){
    if (isDropMove(i)) { return i; }
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.to = algebraic(move.to);
    if (!isDropMove(move.from)) {
      move.from = algebraic(move.from);
    }

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;
    if (isDropMove(move.from)) {
      move.flags = 'd';
    }

    return move;
  }

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  return {
    /***************************************************************************
     * PUBLIC API
     **************************************************************************/

    reset: function() {
      return reset();
    },

    in_check: function() {
      return in_check();
    },

    game_over: function() {
      return in_checkmate();
    },

    turn: function() {
      return turn;
    },

    move: function(move) {
      /* The move function can be called with in the following parameters:
      * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */
      var move_obj = null;
      var moves = generatedMoves;

      for (var i = 0, len = moves.length; i < len; i++) {
        if (move.from === algebraic(moves[i].from) &&
            move.to === algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
            move.promotion === moves[i].promotion)) {
          move_obj = moves[i];
          break;
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null;
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);
      make_move(move_obj);

      // keeping an array with promoted pieces
      if (move_obj.promotion) {
        promoted.push(move_obj.to);
      } else {
        const indexFrom = promoted.indexOf(move_obj.from);
        const indexTo = promoted.indexOf(move_obj.to);
        if (indexFrom > -1 && indexTo === -1) {
          promoted[indexFrom] = move_obj.to;
        } else if (indexFrom === -1 && indexTo > -1) {
          promoted.splice(indexTo, 1);
        } else if (indexFrom > -1 && indexTo > -1) {
          promoted.splice(indexFrom, 1);
        }
      }
      preGenerateMoves();
      return pretty_move;
    },

    put: function(piece, square) {
      return put(piece, square);
    },

    get: function(square) {
      return get(square);
    },

    addFreePiece: function(piece) {
      if ([KNIGHT, ROOK, BISHOP, QUEEN, PAWN].indexOf(piece.type) === -1) return;
      if (piece.color === WHITE) {
        whiteFreePieces.push(piece.type)
      }
      if (piece.color === BLACK) {
        blackFreePieces.push(piece.type)
      }
    },

    removeFreePiece: function(color, piece) {
      if ([KNIGHT, ROOK, BISHOP, QUEEN, PAWN].indexOf(piece) === -1) return;
      if (color === WHITE) {
        var index = whiteFreePieces.indexOf(piece);
        if (index > -1) whiteFreePieces.splice(index, 1);
      }
      if (color === BLACK) {
        var index = blackFreePieces.indexOf(piece);
        if (index > -1) blackFreePieces.splice(index, 1);
      }
    },

    getFreePieces: function(color) {
      if (color === WHITE) {
        return whiteFreePieces;
      }
      if (color === BLACK) {
        return blackFreePieces;
      }
    },

    getState: function() {
      return {
        board: board,
        promoted: promoted,
        kings: kings,
        turn: turn,
        castling: castling,
        ep_square: ep_square,
        blackFreePieces: blackFreePieces,
        whiteFreePieces: whiteFreePieces,
        generatedMoves: generatedMoves.map(move => make_pretty(move))
      }
    },

    setState: function(state) {
      board = state.board;
      promoted = state.promoted;
      kings = state.kings;
      turn = state.turn;
      castling = state.castling;
      ep_square = state.ep_square;
      blackFreePieces = state.blackFreePieces;
      whiteFreePieces = state.whiteFreePieces;
      preGenerateMoves();
    },

    preLoadMoves: function() {
      preGenerateMoves();
    }

  };
};
