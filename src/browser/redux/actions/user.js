import Promise from 'bluebird';

export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';

export const actions = {
  authUser
};

export function authUser(socket) {
  return {
    type: USER_AUTHENTICATE
  };
}
