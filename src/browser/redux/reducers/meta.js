import actions from '../../../common/actionConstants';
import Immutable, {Record, Map} from 'immutable';
import {getElo} from '../../../common/chess';

const InitialState = Record({
  onlinecount: 0,
  games: new Map(),
  rankings: new Map(),
});

const initialState = new InitialState;

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SERVER_ONLINECOUNT_UPDATE: {
      return state.update('onlinecount', () => action.onlinecount);
    }

    case actions.SERVER_SYNC_GAMES: {
      return state
        .update('rankings', () => Immutable.fromJS(action.rankings))
        .update('games', () => Immutable.fromJS(action.games));
    }

    case actions.SERVER_WINNER: {
      const newElo = getElo(
        state.getIn(['rankings', action.heroWhite]),
        state.getIn(['rankings', action.heroBlack]),
        state.getIn(['rankings', action.villainWhite]),
        state.getIn(['rankings', action.villainBlack]),
      );
      return state
        .update('rankings', rankings => rankings.set(action.heroWhite, newElo.heroWhite))
        .update('rankings', rankings => rankings.set(action.heroBlack, newElo.heroBlack))
        .update('rankings', rankings => rankings.set(action.villainWhite, newElo.villainWhite))
        .update('rankings', rankings => rankings.set(action.villainBlack, newElo.villainBlack));
    }
  }
  return state;
}
