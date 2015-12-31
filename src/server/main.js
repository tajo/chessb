import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';
import http from 'http';
import socketIo from 'socket.io';

const {port} = config;
const app = express();
const server = http.Server(app);
const io = socketIo(server);

server.listen(port, () => {
  console.log('Server started at port %d', port);
});

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

io.on('connection', (socket) => {
  socket.emit('news', {hello: 'worldddd'});
  socket.on('my other event', (data) => {
    console.log(data);
  });
});
