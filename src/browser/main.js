import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {syncReduxAndRouter} from 'redux-simple-router';
import routes from './routes';
import Root from './containers/Root';
import configureStore from '../common/configureStore';
import io from 'socket.io-client';
import rootReducer from './redux/reducers';
import {authUser} from './redux/actions/user';

const socket = io();
const history = createBrowserHistory();
const store = configureStore(socket, rootReducer);

store.dispatch(authUser(store.getState().user.get('hashId')));
socket.on('action', action => {
  action.broadcast = false;
  action.room = false;
  return store.dispatch(action);
});


syncReduxAndRouter(history, store, (state) => state.router);

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('app')
);
