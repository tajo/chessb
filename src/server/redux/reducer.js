import actions from '../../common/actionConstants';
import {Record, List, Map, OrderedMap} from 'immutable';
import Chess from '../../common/engine';
import {translatePieceReverse, getPieceColor, getElo} from '../../common/chess';
import shortid from 'shortid';
import {COLORS, GAME_TIME, GAME_DELAY} from '../../common/constants';
import moment from 'moment';

const BoardState = Record({
  engine: null,
  moves: List(),
  dates: List(),
  WHITE: null,
  BLACK: null
});

const Game = Record({
  gameId: null,
  aBoard: null,
  bBoard: null,
  winner: null,
  startDate: null,
  chat: List(),
  gameTime: GAME_TIME
});

const UserRecord = Record({
  userId: '',
  token: '',
  gameId: '',
  socketId: '',
  ranking: 1000
});

const MessageState = Record({
  userId: null,
  text: ''
});

const firstGameId = shortid.generate();
const InitialState = Record({
  users: Map(),
  sockets: Map(),
  oldToNewGame: Map(),
  games: OrderedMap().set(firstGameId, new Game({
    gameId: firstGameId,
    aBoard: new BoardState({engine: (new Chess()).getState()}),
    bBoard: new BoardState({engine: (new Chess()).getState()})
  }))
});

const initialState = new InitialState;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.USER_AUTHENTICATE: {
      return state
        .update('sockets', sockets => sockets.set(action.socketId, action.userId))
        .update('users', users => users.set(action.userId, new UserRecord({
          userId: action.userId,
          token: action.token,
          ranking: action.ranking,
          gameId: null,
          socketId: action.socketId
        })));
    }

    case actions.SERVER_USER_DISCONNECT: {
      const inGame = state.getIn(['users', action.userId, 'gameId']);
      if (inGame) {
        state = leaveGame(state, inGame, action.userId);
      }

      if (!action.userId) return state;
      return state
        .update('users', users => users.delete(action.userId))
        .update('games', games => games.filter(game => !!state.get('users').find(user => user.get('gameId') === game.gameId)))
        .update('sockets', sockets => sockets.delete(action.socketId));
    }

    case actions.SWITCH_GAME: {
      if (!state.getIn(['games', action.gameId])) return state;
      return leaveGame(state, state.getIn(['users', action.userId, 'gameId']), action.userId)
        .updateIn(['users', action.userId, 'gameId'], () => action.gameId);
    }

    case actions.RESIGN_GAME: {
      const game = state.getIn(['games', action.gameId]);
      const aWhite = game.getIn(['aBoard', 'WHITE']);
      const aBlack = game.getIn(['aBoard', 'BLACK']);
      const bWhite = game.getIn(['bBoard', 'WHITE']);
      const bBlack = game.getIn(['bBoard', 'BLACK']);

      if (action.userId === aWhite) {
        return state.updateIn(['games', action.gameId, 'winner'], () => Map({board: 'aBoard', color: 'BLACK'}));
      }

      if (action.userId === aBlack) {
        return state.updateIn(['games', action.gameId, 'winner'], () => Map({board: 'aBoard', color: 'WHITE'}));
      }

      if (action.userId === bWhite) {
        return state.updateIn(['games', action.gameId, 'winner'], () => Map({board: 'bBoard', color: 'BLACK'}));
      }
      return state.updateIn(['games', action.gameId, 'winner'], () => Map({board: 'bBoard', color: 'WHITE'}));
    }

    case actions.SERVER_FIND_SEAT: {
      const freeSeatBoards = state.get('games').filter(game => {
        return !game.getIn(['aBoard', 'WHITE']) ||
               !game.getIn(['aBoard', 'BLACK']) ||
               !game.getIn(['bBoard', 'WHITE']) ||
               !game.getIn(['bBoard', 'BLACK']);
      });

      const rankedBoards = freeSeatBoards.map(game => {
        let tableElo = 0;
        let playersAtTable = 0;
        if (game.getIn(['aBoard', 'WHITE'])) {
          tableElo += state.getIn(['users', game.getIn(['aBoard', 'WHITE']), 'ranking']);
          playersAtTable += 1;
        }
        if (game.getIn(['aBoard', 'BLACK'])) {
          tableElo += state.getIn(['users', game.getIn(['aBoard', 'BLACK']), 'ranking']);
          playersAtTable += 1;
        }
        if (game.getIn(['bBoard', 'WHITE'])) {
          tableElo += state.getIn(['users', game.getIn(['bBoard', 'WHITE']), 'ranking']);
          playersAtTable += 1;
        }
        if (game.getIn(['bBoard', 'BLACK'])) {
          tableElo += state.getIn(['users', game.getIn(['bBoard', 'BLACK']), 'ranking']);
          playersAtTable += 1;
        }
        const rank = playersAtTable === 0 ? 0 : tableElo / playersAtTable;
        return Map({gameId: game.get('gameId'), ranking: rank});
      });

      const sortedRankedBoards = rankedBoards.sort((gameA, gameB) => {
        if (gameA.get('ranking') > gameB.get('ranking')) return 1;
        if (gameB.get('ranking') > gameA.get('ranking')) return -1;
        return 0;
      });

      let bestMatch = null;
      sortedRankedBoards.forEach(game => {
        if (state.getIn(['users', action.userId, 'ranking']) > (game.get('ranking') - 200)) {
          bestMatch = game.get('gameId');
        }
      });

      if (bestMatch) {
        return state.updateIn(['users', action.userId, 'gameId'], () => bestMatch);
      }
      const newGameId = shortid.generate();
      return state
        .updateIn(['users', action.userId, 'gameId'], () => newGameId)
        .update('games', games => games.set(newGameId, new Game({
          gameId: newGameId,
          aBoard: new BoardState({engine: (new Chess()).getState()}),
          bBoard: new BoardState({engine: (new Chess()).getState()})
        })));
    }

    case actions.JOIN_LEAVE_GAME: {
      return joinLeaveGame(state, action);
    }

    case actions.ADD_NEW_GAME: {
      if (state.get('games').every(game => {
        return game.getIn(['aBoard', COLORS.WHITE]) ||
               game.getIn(['aBoard', COLORS.BLACK]) ||
               game.getIn(['bBoard', COLORS.WHITE]) ||
               game.getIn(['bBoard', COLORS.BLACK]);
      })) {
        const newGameId = shortid.generate();
        return state
          .update('games', games => games.set(newGameId, new Game({
            gameId: newGameId,
            aBoard: new BoardState({engine: (new Chess()).getState()}),
            bBoard: new BoardState({engine: (new Chess()).getState()})
          })));
      }
      return state;
    }

    case actions.MOVE: {
      if (action.room) return state;
      if (!state.getIn(['games', action.gameId, 'startDate'])) return state;
      if (state.getIn(['games', action.gameId, 'winner'])) return state;

      // check if move is made by player that claims the move
      if (state.getIn(['games', action.gameId, action.board, getPieceColor(action.piece)]) !== action.userId) {
        return state;
      }

      const engine = new Chess(state.getIn(['games', action.gameId, action.board, 'engine']));

      // give the captured pieces to other board
      const endPiece = engine.get(action.end);

      // make move
      const result = engine.move({from: action.start, to: action.end, promotion: action.promotion});
      if (!result) return state;

      state = state.updateIn(['games', action.gameId, action.board, 'dates'], dates => dates.push(action.date));

      if (endPiece) {
        const engineOther = new Chess(state.getIn(['games', action.gameId, action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine']));
        engineOther.addFreePiece(endPiece);
        engineOther.preLoadMoves();
        state = state.updateIn(['games', action.gameId, action.board === 'aBoard' ? 'bBoard' : 'aBoard', 'engine'], () => engineOther.getState());
      }

      // drop piece
      if (['p', 'r', 'q', 'n', 'b'].some(p => p === action.start)) {
        engine.removeFreePiece(translatePieceReverse(action.piece).color, action.start);
      }

      // end of game
      if (engine.game_over()) {
        state = state.updateIn(['games', action.gameId, 'winner'], () => Map({board: action.board, color: getPieceColor(action.piece)}));
      }

      return state
        .updateIn(['games', action.gameId, action.board, 'moves'], board => board.push(Map({from: action.start, to: action.end, promotion: action.promotion})))
        .updateIn(['games', action.gameId, action.board, 'engine'], () => engine.getState());
    }

    case actions.TIME_RAN_OUT: {
      if (state.getIn(['games', action.gameId, 'winner'])) {
        return state;
      }
      const interval = state.getIn(['games', action.gameId, 'gameTime']);
      const startDate = state.getIn(['games', action.gameId, 'startDate']);
      let counter = interval;
      state
        .getIn(['games', action.gameId, action.board, 'dates'])
        .push(moment().toISOString())
        .unshift(startDate)
        .forEach((val, index, arr) => {
          if (action.color === COLORS.WHITE && (index % 2) && index) {
            counter = counter - moment(val).diff(moment(arr.get(index - 1)));
          }
          if (action.color === COLORS.BLACK && !(index % 2) && index) {
            counter = counter - moment(val).diff(moment(arr.get(index - 1)));
          }
        });
      if (counter <= 500) {
        return state
          .updateIn(['games', action.gameId, 'aBoard', 'dates'], dates => dates.push(moment().toISOString()))
          .updateIn(['games', action.gameId, 'bBoard', 'dates'], dates => dates.push(moment().toISOString()))
          .updateIn(['games', action.gameId, 'winner'], () => {
            return Map({board: action.board, color: action.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE});
          });
      }

      return state;
    }

    case actions.SERVER_GAME_TO_NEW_GAME: {
      const winner = state.getIn(['games', action.gameId, 'winner']);
      if (!winner) {
        return state;
      }
      const aWhite = state.getIn(['games', action.gameId, 'aBoard', COLORS.WHITE]);
      const aBlack = state.getIn(['games', action.gameId, 'aBoard', COLORS.BLACK]);
      const bWhite = state.getIn(['games', action.gameId, 'bBoard', COLORS.WHITE]);
      const bBlack = state.getIn(['games', action.gameId, 'bBoard', COLORS.BLACK]);

      const winnerTop = (winner.get('board') === 'aBoard' && winner.get('color') === COLORS.BLACK) ||
                        (winner.get('board') === 'bBoard' && winner.get('color') === COLORS.WHITE);
      const winnerDown = (winner.get('board') === 'aBoard' && winner.get('color') === COLORS.WHITE) ||
                         (winner.get('board') === 'bBoard' && winner.get('color') === COLORS.BLACK);
      const newGameId = shortid.generate();
      return state
        .update('games', games => games.set(newGameId, new Game({
          gameId: newGameId,
          aBoard: new BoardState({
            engine: (new Chess()).getState(),
            WHITE: winnerDown ? aWhite : bBlack,
            BLACK: winnerTop ? aBlack : bWhite
          }),
          bBoard: new BoardState({
            engine: (new Chess()).getState(),
            WHITE: winnerTop ? bWhite : aBlack,
            BLACK: winnerDown ? bBlack : aWhite
          }),
          startDate: (aWhite && aBlack && bWhite && bBlack) ? moment().add(GAME_DELAY, 'ms').toISOString() : null
        })))
        .update('users', users => {
          return users.map(user => {
            if (user.get('gameId') !== action.gameId) return user;
            return new UserRecord({
              userId: user.get('userId'),
              token: user.get('token'),
              gameId: newGameId,
              socketId: user.get('socketId'),
              ranking: user.get('ranking')
            });
          });
        })
        .update('games', games => games.delete(action.gameId))
        .update('oldToNewGame', oldToNewGame => oldToNewGame.set(action.gameId, newGameId));
    }

    case actions.SERVER_SEND_CHAT: {
      return state
          .updateIn(['games', action.gameId, 'chat'], chat =>
            chat.push(new MessageState({userId: action.userId, text: action.text})));
    }

    case actions.SERVER_WINNER: {
      const newElo = getElo(
        state.getIn(['users', action.heroWhite, 'ranking']),
        state.getIn(['users', action.heroBlack, 'ranking']),
        state.getIn(['users', action.villainWhite, 'ranking']),
        state.getIn(['users', action.villainBlack, 'ranking']),
      );
      console.log(newElo);
      return state
        .update('users', users => users.setIn([action.heroWhite, 'ranking'], newElo.heroWhite))
        .update('users', users => users.setIn([action.heroBlack, 'ranking'], newElo.heroBlack))
        .update('users', users => users.setIn([action.villainWhite, 'ranking'], newElo.villainWhite))
        .update('users', users => users.setIn([action.villainBlack, 'ranking'], newElo.villainBlack));
    }

  }
  return state;
}

function leaveGame(state, gameId, userId) {
  if (!gameId) return state;
  state = leaveGameVariant(state, gameId, userId, 'aBoard', COLORS.WHITE);
  state = leaveGameVariant(state, gameId, userId, 'aBoard', COLORS.BLACK);
  state = leaveGameVariant(state, gameId, userId, 'bBoard', COLORS.WHITE);
  state = leaveGameVariant(state, gameId, userId, 'bBoard', COLORS.BLACK);
  return state;
}

function leaveGameVariant(state, gameId, userId, board, color) {
  if (state.getIn(['games', gameId, board, color]) === userId) {
    return joinLeaveGame(state, {gameId: gameId, userId: userId, board: board, color: color});
  }
  return state;
}

function joinLeaveGame(state, action) {
  const userId = state.getIn(['users', action.userId, 'userId']);
  const checkA = state.getIn(['games', action.gameId, action.board === 'bBoard' ? 'aBoard' : 'bBoard', action.color]);
  const checkB = state.getIn(['games', action.gameId, action.board, action.color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK]);
  if (checkA !== userId && checkB !== userId) {
    state = state.updateIn(['games', action.gameId, action.board, action.color], _userId => {
      if (!_userId) return userId;
      if (_userId === userId) return null;
      return userId;
    });
  }

  // if game is full start it!
  const aBoardWhite = state.getIn(['games', action.gameId, 'aBoard', COLORS.WHITE]);
  const aBoardBlack = state.getIn(['games', action.gameId, 'aBoard', COLORS.BLACK]);
  const bBoardWhite = state.getIn(['games', action.gameId, 'bBoard', COLORS.WHITE]);
  const bBoardBlack = state.getIn(['games', action.gameId, 'bBoard', COLORS.BLACK]);
  const startDate = state.getIn(['games', action.gameId, 'startDate']);

  if (aBoardWhite && aBoardBlack && bBoardWhite && bBoardBlack) {
    if (!startDate) {
      state = state.updateIn(['games', action.gameId, 'startDate'], () => moment().add(GAME_DELAY, 'ms').toISOString());
    }
  } else {
    if (startDate && moment(startDate).diff(moment()) > 0) {
      state = state.updateIn(['games', action.gameId, 'startDate'], () => null);
    }
  }
  return state;
}
