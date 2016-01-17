import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';
import http from 'http';
import socketIo from 'socket.io';
import configureStore from '../common/configureStore';
import rootReducer from './redux/reducer';
import moment from 'moment';
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
  console.log('=================================================');
  console.log(store.getState());
});

io.on('connection', (socket) => {
  socket.on('action', (action) => {
    action.socketId = socket.id;
    if (action.remote) delete action.remote;
    let userId = store.getState().getIn(['sockets', socket.id]);
    action.userId = userId;
    console.log(action);

    if (action.type === 'USER_AUTHENTICATE') {
      store.dispatch(action);
      userId = store.getState().getIn(['sockets', socket.id]);
      store.dispatch(actions.authUser(socket.id, userId));
      store.dispatch(actions.onlinecountSet(store.getState().get('sockets').count()));
      store.dispatch(actions.findSeat(userId));
      store.dispatch(actions.getInitGames(socket.id, store.getState().get('games'), store.getState().get('users')));
      const gameId = store.getState().getIn(['users', userId, 'gameId']);
      store.dispatch(actions.pushUrl(socket.id, `/game/${gameId}`));
      store.dispatch(actions.joinBoard(socket.id, store.getState().getIn(['games', gameId])));
      socket.join(gameId);
    }

    if (action.type === 'JOIN_LEAVE_GAME') {
      store.dispatch(action);
      const takenSeatId = store.getState().getIn(['games', action.gameId, action.board, action.color]);
      const startDate = store.getState().getIn(['games', action.gameId, 'startDate']);
      store.dispatch(actions.seatChanged(action.gameId, action.board, action.color, takenSeatId, startDate));
    }

    if (action.type === 'MOVE') {
      action.gameId = store.getState().getIn(['users', userId, 'gameId']);
      action.date = moment().toISOString();
      if (action.gameId) {
        const datesBefore = store.getState().getIn(['games', action.gameId, action.board, 'dates']);
        store.dispatch(action);
        const datesAfter = store.getState().getIn(['games', action.gameId, action.board, 'dates']);
        if (datesAfter.count() > datesBefore.count()) {
          action.room = action.gameId;
          store.dispatch(action);
        }
      }
    }

    if (action.type === 'TIME_RAN_OUT') {
      action.gameId = store.getState().getIn(['users', userId, 'gameId']);
      action.date = moment().toISOString();
      if (action.gameId) {
        store.dispatch(action);
        store.dispatch(actions.winner(action.gameId, store.getState().getIn(['games', action.gameId, 'winner'])));
      }
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
