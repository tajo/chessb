export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';
export const USER_DISCONNECT = 'USER_DISCONNECT';
export const META_ONLINECOUNTSET = 'META_ONLINECOUNTSET';
export const GAME_MOVE = 'GAME_MOVE';
export const GAMES_ADD_PLAYER = 'GAMES_ADD_PLAYER';

export const actions = {
  authUser,
  disconnectUser,
  onlinecountSet,
  addPlayer,
};

export function addPlayer(userId) {
  return {
    type: GAMES_ADD_PLAYER,
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
