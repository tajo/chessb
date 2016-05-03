import actions from '../../../common/actionConstants';

export const actionCreators = {
  addUser,
  authUser,
  signInUser,
};

export function authUser(token, gameId = null) {
  return {
    type: actions.USER_AUTHENTICATE,
    token: token,
    gameId: gameId,
    remote: true
  };
}

export function addUser(email, password, userId, token) {
  return ({post}) => {
    return {
      type: actions.USER_ADD,
      payload: {
        promise: post('/api/user', {
          email: email,
          password: password,
          newUserId: userId,
          token: token,
        })
        .then(response => response.json()),
      },
    };
  };
}

export function signInUser(userId, password) {
  return ({post}) => {
    return {
      type: actions.USER_SIGN_IN,
      payload: {
        promise: post('/api/user/signin', {
          password: password,
          userId: userId,
        })
        .then(response => response.json()),
      },
    };
  };
}
