import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import user from './user';
import game from './game';
import meta from './meta';

export default combineReducers({
  game,
  user,
  meta,
  routing: routerReducer
});
