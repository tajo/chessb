import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import counter from './counter';
import user from './user';
import game from './game';
import meta from './meta';

export default combineReducers({
  counter,
  game,
  user,
  meta,
  router: routeReducer
});