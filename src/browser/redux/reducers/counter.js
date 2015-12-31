import * as actions from '../actions/counter';
import {Record} from 'immutable';

const InitialState = Record({
  counter: 0
});

const initialState = new InitialState;

export default function counterReducer (state = initialState, action) {
  switch (action.type) {
    case actions.COUNTER_INCREMENT: {
      return state.update('counter', counter => counter + 1);
    }

    case actions.COUNTER_DOUBLE_INCREMENT_SUCCESS: {
      return state.update('counter', counter => counter + 2);
    }
  }
  return state;
}
