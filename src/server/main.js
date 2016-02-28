import config from './config';
import express from 'express';
import frontend from './frontend';
import http from 'http';
import socketIo from 'socket.io';
import configureStore from '../common/configureStore';
import rootReducer from './redux/reducer';
import response from './response';
import constants from '../common/actionConstants';

const {port} = config;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

server.listen(port, () => {
  console.log('Server started at port %d', port);
});

const store = configureStore(io, rootReducer);
store.subscribe(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('==============================================');
    console.log(store.getState());
  }
});

io.on('connection', socket => {
  socket.on('action', action => {
    action.socketId = socket.id;
    action.userId = store.getState().getIn(['sockets', socket.id]);
    if (action.remote) delete action.remote;
    if (process.env.NODE_ENV === 'development') console.log(action);
    response({
      action,
      getState: store.getState,
      dispatch: store.dispatch,
      socket,
      socketAdapter: io.sockets.adapter,
    });
  });

  socket.on('disconnect', () => response({
    action: {type: constants.DISCONNECT},
    getState: store.getState,
    dispatch: store.dispatch,
    socket,
    socketAdapter: io.sockets.adapter,
  }));
});

app.use(frontend);
