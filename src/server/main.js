import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';
import http from 'http';
import socketIo from 'socket.io';
import configureStore from '../common/configureStore';
import rootReducer from './redux/reducer';
import * as actions from './redux/actions';

const {port} = config;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

server.listen(port, () => {
  console.log('Server started at port %d', port);
});

const store = configureStore(io, rootReducer);
store.subscribe(() => {
  console.log('=============***====================================');
  console.log(store.getState());
});

io.on('connection', (socket) => {
  socket.on('action', (action) => {
    action.socketId = socket.id;
    action.remote = false;
    console.log(action);
    store.dispatch(action);
    if (action.type === 'USER_AUTHENTICATE') {
      store.dispatch(actions.onlinecountSet(store.getState().get('sockets').count()));
      store.dispatch(actions.addPlayer(store.getState().getIn(['sockets', socket.id])));
    }
  });

  socket.on('disconnect', () => {
    store.dispatch(actions.disconnectUser(socket.id));
    store.dispatch(actions.onlinecountSet(store.getState().get('sockets').count()));
  });
});

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);
