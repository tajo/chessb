export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';
export const USER_DISCONNECT = 'USER_DISCONNECT';
export const META_ONLINECOUNTSET = 'META_ONLINECOUNTSET';
export const GAME_MOVE = 'GAME_MOVE';
export const GAMES_ADD_PLAYER = 'GAMES_ADD_PLAYER';
export const GAMES_FIND_SEAT = 'GAMES_FIND_SEAT';
export const JOIN_BOARD = 'JOIN_BOARD';
export const GAME_JOIN_LEAVE = 'GAME_JOIN_LEAVE';
export const SEAT_CHANGED = 'SEAT_CHANGED';

export const actions = {
  authUser,
  disconnectUser,
  onlinecountSet,
  findSeat,
  pushUrl,
  joinBoard,
  seatChanged
};

export function findSeat(userId) {
  return {
    type: GAMES_FIND_SEAT,
    userId: userId
  };
}


export function onlinecountSet(count) {
  return {
    type: META_ONLINECOUNTSET,
    onlinecount: count,
    broadcast: true
  };
}

export function authUser(socketId, userId) {
  return {
    type: USER_AUTHENTICATE,
    userId: userId,
    room: socketId
  };
}

export function disconnectUser(socketId) {
  return {
    type: USER_DISCONNECT,
    socketId: socketId
  };
}

export function pushUrl(socketId, url) {
  return {
    type: '@@router/UPDATE_PATH',
    payload: {
      path: url,
      state: null,
      replace: true,
      avoidRouterUpdate: false
    },
    room: socketId
  };
}

export function joinBoard(socketId, game) {
  return {
    type: JOIN_BOARD,
    room: socketId,
    game: game
  };
}

export function seatChanged(gameId, board, color, userId) {
  return {
    type: SEAT_CHANGED,
    room: gameId,
    gameId: gameId,
    board: board,
    color: color,
    userId: userId
  };
}
