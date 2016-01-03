import {combineReducers} from 'redux';
import users from './users';
import games from './games';

export default combineReducers({
  users,
  games
});
