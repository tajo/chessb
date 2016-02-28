import {push} from 'react-router-redux';
import actions from '../../common/actionConstants';

export function findSeat(userId) {
  return {
    type: actions.SERVER_FIND_SEAT,
    userId: userId
  };
}

export function onlinecountSet(count) {
  return {
    type: actions.SERVER_ONLINECOUNT_UPDATE,
    onlinecount: count,
    broadcast: true
  };
}

export function authUser(socketId, userId) {
  return {
    type: actions.SERVER_USER_AUTHENTICATE,
    userId: userId,
    room: socketId
  };
}

export function disconnectUser(socketId, userId) {
  return {
    type: actions.SERVER_USER_DISCONNECT,
    socketId: socketId,
    userId: userId
  };
}

export function pushUrl(socketId, url) {
  const pushAction = push(url);
  pushAction.room = socketId;
  return pushAction;
}

export function joinBoard(socketId, game) {
  return {
    type: actions.SERVER_SYNC_BOARD,
    room: socketId,
    game: game
  };
}

export function seatChanged(gameId, board, color, userId, startDate) {
  return {
    type: actions.SERVER_SEAT_CHANGED,
    room: gameId,
    gameId: gameId,
    board: board,
    color: color,
    userId: userId,
    startDate: startDate
  };
}

export function winner(gameId, winner) {
  return {
    type: actions.SERVER_WINNER,
    room: gameId,
    winner: winner
  };
}

export function syncGames(games, users) {
  return {
    type: actions.SERVER_SYNC_GAMES,
    broadcast: true,
    games: getGameList(games, users)
  };
}

export function switchGame(gameId, userId) {
  return {
    type: actions.SWITCH_GAME,
    userId: userId,
    gameId: gameId
  };
}

export function sendChat(gameId, userId, text) {
  return {
    type: actions.SERVER_SEND_CHAT,
    userId: userId,
    room: gameId,
    text: text
  };
}

export function gameToNewGame(gameId) {
  return {
    type: actions.SERVER_GAME_TO_NEW_GAME,
    gameId: gameId
  };
}

function getGameList(games, users) {
  return games.map(game => {
    let players = 0;
    if (game.aBoard.WHITE) players += 1;
    if (game.aBoard.BLACK) players += 1;
    if (game.bBoard.WHITE) players += 1;
    if (game.bBoard.BLACK) players += 1;
    let realPlayers = players;
    if (game.aBoard.WHITE && game.aBoard.WHITE === game.bBoard.BLACK) realPlayers -= 1;
    if (game.aBoard.BLACK && game.aBoard.BLACK === game.bBoard.WHITE) realPlayers -= 1;
    return {
      gameId: game.gameId,
      startDate: game.startDate,
      players: players,
      specs: users.filter(user => user.gameId === game.gameId).count() - realPlayers
    };
  });
}
