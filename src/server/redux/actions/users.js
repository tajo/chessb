export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';
export const USER_DISCONNECT = 'USER_DISCONNECT';

export const actions = {
  authUser,
  disconnectUser
};

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
