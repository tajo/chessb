export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';
export const USER_DISCONNECT = 'USER_DISCONNECT';
export const META_ONLINECOUNTSET = 'META_ONLINECOUNTSET';
export const GAME_MOVE = 'GAME_MOVE';
export const GAMES_ADD_PLAYER = 'GAMES_ADD_PLAYER';
export const GAMES_FIND_SEAT = 'GAMES_FIND_SEAT';

export const actions = {
  authUser,
  disconnectUser,
  onlinecountSet,
  findSeat
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

export function authUser() {
  return {
    type: USER_AUTHENTICATE
  };
}

export function disconnectUser(socketId) {
  return {
    type: USER_DISCONNECT,
    socketId: socketId
  };
}
