import * as actions from '../actions/user';
import shortid from 'shortid';
import {Record} from 'immutable';

function getHashId() {
  if (window === 'undefined') {
    return null;
  }
  if (localStorage.getItem('hashId')) {
    return localStorage.getItem('hashId');
  }
  const hashId = shortid.generate();
  localStorage.setItem('hashId', hashId);
  return hashId;
}

const InitialState = Record({
  hashId: getHashId()
});

const initialState = new InitialState;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.COUNTER_INCREMENT: {
      return state.update('counter', counter => counter + 1);
    }
  }
  return state;
}
