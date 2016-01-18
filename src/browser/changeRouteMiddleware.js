import {UPDATE_LOCATION} from 'redux-simple-router';

export default () => next => action => {
  //  if (action.type === UPDATE_LOCATION)
  return next(action);
};
