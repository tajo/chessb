import actions from '../../common/actionConstants';

export function findSeat(userId) {
  return {
    type: actions.SERVER_FIND_SEAT,
    userId: userId
  };
}


export function onlinecountSet(count) {
  return {
    type: actions.SERVER_ONLINECOUNT_UPDATE,
    onlinecount: count,
    broadcast: true
  };
}

export function authUser(socketId, userId) {
  return {
    type: actions.SERVER_USER_AUTHENTICATE,
    userId: userId,
    room: socketId
  };
}

export function disconnectUser(socketId) {
  return {
    type: actions.SERVER_USER_DISCONNECT,
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
    type: actions.SERVER_JOIN_BOARD,
    room: socketId,
    game: game
  };
}

export function seatChanged(gameId, board, color, userId) {
  return {
    type: actions.SERVER_SEAT_CHANGED,
    room: gameId,
    gameId: gameId,
    board: board,
    color: color,
    userId: userId
  };
}
