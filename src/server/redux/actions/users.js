export const USER_AUTHENTICATE = 'USER_AUTHENTICATE';

export const actions = {
  authUser
};

export function authUser() {
  return {
    type: USER_AUTHENTICATE
  };
}
