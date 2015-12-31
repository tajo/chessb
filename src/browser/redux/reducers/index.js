import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import counter from './counter';
import game from './game';

export default combineReducers({
  counter,
  game,
  router: routeReducer
});
