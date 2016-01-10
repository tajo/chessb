import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import user from './user';
import game from './game';
import meta from './meta';

export default combineReducers({
  game,
  user,
  meta,
  router: routeReducer
});
