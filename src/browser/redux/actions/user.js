import actions from '../../../common/actionConstants';

export const actionCreators = {
  authUser
};

export function authUser(hashId) {
  return {
    type: actions.USER_AUTHENTICATE,
    hashId: hashId,
    remote: true
  };
}
