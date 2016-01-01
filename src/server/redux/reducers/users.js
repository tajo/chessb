import * as actions from '../actions/users';
import shortid from 'shortid';
import {Record} from 'immutable';

const InitialState = Record({
  hashId: shortid.generate()
});

const initialState = new InitialState;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.USER_AUTHENTICATE: {
      console.log(action.type);
      return state.update('users', id => id);
    }
  }
  return state;
}
