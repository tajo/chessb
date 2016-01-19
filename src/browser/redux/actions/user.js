import actions from '../../../common/actionConstants';

export const actionCreators = {
  authUser
};

export function authUser(hashId, gameId = null) {
  return {
    type: actions.USER_AUTHENTICATE,
    hashId: hashId,
    gameId: gameId,
    remote: true
  };
}
