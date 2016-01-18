import React from 'react';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import ReactDOM from 'react-dom';
import {syncHistory} from 'redux-simple-router';
import routes from './routes';
import Root from './containers/Root';
import configureStore from '../common/configureStore';
import io from 'socket.io-client';
import rootReducer from './redux/reducers';
import {authUser} from './redux/actions/user';
import changeRouteMiddleware from './changeRouteMiddleware';

const socket = io();
const browserHistory = createBrowserHistory();
const reduxRouterMiddleware = syncHistory(browserHistory);
const store = configureStore(
  socket,
  rootReducer,
  [reduxRouterMiddleware, changeRouteMiddleware]
);

store.dispatch(authUser(store.getState().user.get('hashId')));
socket.on('action', action => {
  if (action.broadcast) delete action.broadcast;
  if (action.room) delete action.room;
  return store.dispatch(action);
});

// Render the React application to the DOM
ReactDOM.render(
  <Root history={browserHistory} routes={routes} store={store} />,
  document.getElementById('app')
);
