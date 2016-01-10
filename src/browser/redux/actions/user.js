export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';
export const JOIN_BOARD = 'JOIN_BOARD';

export const actions = {
  authUser
};

export function authUser(hashId) {
  return {
    type: USER_AUTHENTICATE,
    hashId: hashId,
    remote: true
  };
}
