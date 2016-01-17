import actions from '../../../common/actionConstants';
import Immutable, {Record, Map} from 'immutable';

const InitialState = Record({
  onlinecount: 0,
  games: new Map()
});

const initialState = new InitialState;

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SERVER_ONLINECOUNT_UPDATE: {
      return state.update('onlinecount', () => action.onlinecount);
    }

    case actions.SERVER_SYNC_GAMES: {
      return state.update('games', () => Immutable.fromJS(action.games));
    }
  }
  return state;
}
