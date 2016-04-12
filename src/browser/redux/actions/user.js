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
  return ({ post }) => {
    return {
      type: actions.USER_ADD,
      payload: {
        promise: post('/api/user', {
          email: email,
          password: password,
          newUserId: userId,
        })
        .then(response => response.json()),
      },
    };
  };
}
