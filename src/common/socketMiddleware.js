export default io => () => next => action => {
  if (action.remote) {
    io.emit('action', action);
  }

  if (action.room) {
    io.to(action.room).emit('action', action);
  }

  if (action.broadcast) {
    io.sockets.emit('action', action);
  }

  return next(action);
};
