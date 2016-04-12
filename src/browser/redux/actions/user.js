import actions from '../../../common/actionConstants';

export const actionCreators = {
  addUser,
  authUser,
};

export function authUser(token, gameId = null) {
  return {
    type: actions.USER_AUTHENTICATE,
    token: token,
    gameId: gameId,
    remote: true
  };
}

export function addUser(email, password, userId) {
  return {
    type: actions.USER_ADD,
    email: email,
    password: password,
    newUserId: userId,
    remote: true
  };
}
