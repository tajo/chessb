import React from 'react';
import {browserHistory} from 'react-router';
import ReactDOM from 'react-dom';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import routes from './routes';
import Root from './containers/Root';
import configureStore from '../common/configureStore';
import io from 'socket.io-client';
import rootReducer from './redux/reducers';
import {authUser} from './redux/actions/user';
import actions from '../common/actionConstants';

const socket = io();
const store = configureStore(
  socket,
  rootReducer,
  [routerMiddleware(browserHistory)]
);
const history = syncHistoryWithStore(browserHistory, store);

// user put in an url with game id, let's skip automatic seat selection
const initUrl = store.getState().routing.locationBeforeTransitions.pathname.split('/');

let gameId = null;
if (initUrl.length === 3 && initUrl[1] === 'game' && initUrl[2].length === 9) {
  gameId = initUrl[2];
}

store.dispatch(authUser(store.getState().user.get('token'), gameId));
socket.on('action', action => {
  if (action.broadcast) delete action.broadcast;
  if (action.room) delete action.room;
  if (action.token) localStorage.setItem('token', action.token);
  if (action.type === actions.MOVE) {
      const clickSound = new Audio('/assets/click.wav');
      clickSound.load();
      clickSound.play();
  }
  if (action.type === actions.SERVER_SEAT_CHANGED) {
      const sitSound = new Audio('/assets/sit.wav');
      sitSound.load();
      sitSound.play();
  }

  return store.dispatch(action);
});

ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('app')
);
