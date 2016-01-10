import actions from '../../../common/actionConstants';
import {Record} from 'immutable';

const InitialState = Record({
  onlinecount: 0
});

const initialState = new InitialState;

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SERVER_META_ONLINECOUNTSET: {
      return state.update('onlinecount', () => action.onlinecount);
    }
  }
  return state;
}
