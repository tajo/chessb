export default socket => store => next => action => {
  if (action.remote) {
    console.log(action);
    socket.emit('action', action);
  }
  return next(action);
};
