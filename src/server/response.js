import moment from 'moment';
import * as actions from './redux/actions';
import {INBETWEEN_DELAY} from '../common/constants';
import constants from '../common/actionConstants';
import {UserModel, GameModel} from './db';
import faker from 'faker';
import shortid from 'shortid';

export default function response(ctx) {
  const res = {};
  res[constants.USER_AUTHENTICATE] = userAuthenticate;
  res[constants.SWITCH_GAME] = switchGame;
  res[constants.JOIN_LEAVE_GAME] = joinLeaveGame;
  res[constants.RESIGN_GAME] = resignGame;
  res[constants.ADD_NEW_GAME] = addNewGame;
  res[constants.SEND_CHAT] = sendChat;
  res[constants.MOVE] = move;
  res[constants.TIME_RAN_OUT] = timeRanOut;
  res[constants.DISCONNECT] = disconnect;
  res[ctx.action.type](ctx);
}

export function userAuthenticate({action, getState, dispatch, socket}) {
  if (!action.token) action.token = shortid.generate();
  UserModel.findOne({token: action.token}).exec()
    .then(user => {
      if (!user) {
        const newUser = new UserModel({
          userId: `${faker.name.firstName()}-${shortid.generate().substring(0, 6)}`,
          token: action.token,
          email: shortid.generate(),
          ranking: 1000,
          password: null,
        });
        return newUser.save();
      }
      return user;
    })
    .then(user => {
      action.userId = user.userId;
      action.ranking = user.ranking;
      dispatch(action);
      const userId = getState().getIn(['sockets', socket.id]);
      dispatch(actions.authUser(socket.id, action.token, userId, !!user.password));
      dispatch(actions.onlinecountSet(getState().get('sockets').count()));
      if (getState().get('games').has(action.gameId)) {
        dispatch(actions.switchGame(action.gameId, userId));
      } else {
        dispatch(actions.findSeat(userId));
      }
      dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
      const gameId = getState().getIn(['users', userId, 'gameId']);
      !getState().get('games').has(action.gameId)
        && dispatch(actions.pushUrl(socket.id, `/game/${gameId}`));
      dispatch(actions.joinBoard(socket.id, getState().getIn(['games', gameId])));
      socket.join(gameId);
    });
}

export function switchGame({action, getState, dispatch, socket}) {
  socket.leave(getState().getIn(['users', action.userId, 'gameId']));
  dispatch(action);
  dispatch(actions.joinBoard(socket.id, getState().getIn(['games', action.gameId])));
  dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
  socket.join(getState().getIn(['users', action.userId, 'gameId']));
}

export function joinLeaveGame({action, getState, dispatch}) {
  dispatch(action);
  const takenSeatId = getState().getIn(['games', action.gameId, action.board, action.color]);
  const startDate = getState().getIn(['games', action.gameId, 'startDate']);
  dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
  dispatch(actions.seatChanged(action.gameId, action.board, action.color, takenSeatId, startDate));
}

export function resignGame({action, getState, dispatch, socketAdapter}) {
  action.gameId = getState().getIn(['users', action.userId, 'gameId']);
  dispatch(action);
  if (getState().getIn(['games', action.gameId, 'winner'])) {
    startNewGame(getState, dispatch, action.gameId, socketAdapter);
  }
}

export function addNewGame({action, getState, dispatch}) {
  dispatch(action);
  dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
}

export function sendChat({action, getState, dispatch}) {
  const gameId = getState().getIn(['users', action.userId, 'gameId']);
  dispatch(actions.sendChat(gameId, action.userId, action.text));
}

export function move({action, getState, dispatch, socketAdapter}) {
  action.gameId = getState().getIn(['users', action.userId, 'gameId']);
  action.date = moment().toISOString();
  if (action.gameId) {
    const datesBefore = getState().getIn(['games', action.gameId, action.board, 'dates']);
    dispatch(action);
    const datesAfter = getState().getIn(['games', action.gameId, action.board, 'dates']);
    if (datesAfter.count() > datesBefore.count()) {
      action.room = action.gameId;
      dispatch(action);
    }
    if (getState().getIn(['games', action.gameId, 'winner'])) {
      startNewGame(getState, dispatch, action.gameId, socketAdapter);
    }
  }
}

export function timeRanOut({action, getState, dispatch, socketAdapter}) {
  action.gameId = getState().getIn(['users', action.userId, 'gameId']);
  action.date = moment().toISOString();
  if (!getState().getIn(['games', action.gameId, 'winner'])) {
    if (action.gameId) {
      dispatch(action);
      if (getState().getIn(['games', action.gameId, 'winner'])) {
        startNewGame(getState, dispatch, action.gameId, socketAdapter);
      }
    }
  }
}

export function disconnect({getState, dispatch, socket}) {
  const userId = getState().getIn(['sockets', socket.id]);
  const gameId = getState().getIn(['users', userId, 'gameId']);
  dispatch(actions.disconnectUser(socket.id, userId));
  if (gameId) {
    dispatch(actions.joinBoard(gameId, getState().getIn(['games', gameId])));
  }
  dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
  dispatch(actions.onlinecountSet(getState().get('sockets').count()));
}

function startNewGame(getState, dispatch, gameId, socketAdapter) {
  const winner = getState().getIn(['games', gameId, 'winner']);
  const game = getState().getIn(['games', gameId]);
  let heroWhite = game.getIn(['aBoard', 'WHITE']);
  let heroBlack = game.getIn(['bBoard', 'BLACK']);
  let villainWhite = game.getIn(['bBoard', 'WHITE']);
  let villainBlack = game.getIn(['aBoard', 'BLACK']);

  if (winner.get('board') === 'bBoard' && winner.get('color') === 'BLACK') {
    heroWhite = heroBlack;
    heroBlack = winner;
  }

  if (winner.get('board') === 'aBoard' && winner.get('color') === 'BLACK') {
    heroBlack = winner;
    const oldHeroWhite = heroWhite;
    heroWhite = villainWhite;
    villainWhite = oldHeroWhite;
    villainBlack = heroBlack;
  }

  if (winner.get('board') === 'bBoard' && winner.get('color') === 'WHITE') {
    heroWhite = winner;
    const oldHeroBlack = heroBlack;
    heroBlack = villainBlack;
    villainWhite = heroWhite;
    villainBlack = oldHeroBlack;
  }

  dispatch(actions.winner(
    gameId,
    getState().getIn(['games', gameId, 'winner']),
    heroWhite,
    heroBlack,
    villainWhite,
    villainBlack
  ));

  const gameDB = new GameModel(getState().getIn(['games', gameId]).toJS());
  gameDB.save();

  UserModel.update({userId: heroWhite}, {ranking: getState().getIn(['users', heroWhite, 'ranking'])}, err => {
    if (err) return console.log(err);
    return null;
  });
  UserModel.update({userId: heroBlack}, {ranking: getState().getIn(['users', heroBlack, 'ranking'])}, err => {
    if (err) return console.log(err);
    return null;
  });
  UserModel.update({userId: villainWhite}, {ranking: getState().getIn(['users', villainWhite, 'ranking'])}, err => {
    if (err) return console.log(err);
    return null;
  });
  UserModel.update({userId: villainBlack}, {ranking: getState().getIn(['users', villainBlack, 'ranking'])}, err => {
    if (err) return console.log(err);
    return null;
  });

  setTimeout(() => {
    dispatch(actions.gameToNewGame(gameId));
    const newGameId = getState().getIn(['oldToNewGame', gameId]);
    getState().get('users').forEach(user => {
      if (user.get('gameId') === newGameId) {
        socketAdapter.add(user.get('socketId'), newGameId);
      }
    });
    dispatch(actions.pushUrl(newGameId, `/game/${newGameId}`));
    dispatch(actions.joinBoard(newGameId, getState().getIn(['games', newGameId])));
    dispatch(actions.syncGames(getState().get('games'), getState().get('users')));
  }, INBETWEEN_DELAY);
}
