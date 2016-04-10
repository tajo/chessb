import actions from '../../../common/actionConstants';

export const actionCreators = {
  authUser
};

export function authUser(token, gameId = null) {
  return {
    type: actions.USER_AUTHENTICATE,
    token: token,
    gameId: gameId,
    remote: true
  };
}
