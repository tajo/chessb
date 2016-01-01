import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';
import http from 'http';
import socketIo from 'socket.io';
import configureStore from '../common/configureStore';
import rootReducer from './redux/reducers';

const {port} = config;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

server.listen(port, () => {
  console.log('Server started at port %d', port);
});

const store = configureStore(false, rootReducer);
// store.subscribe(() => io.emit('action', store.getState().toJS()))

io.on('connection', (socket) => {
  socket.emit('action', {type: 'HELLO'});
  socket.on('action', (action) => store.dispatch(action));
});

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);
