# ChessB

[![Build Status](https://travis-ci.com/tajo/chessb.svg?token=qkyETBiTXs35GEgJTPM5&branch=master)](https://travis-ci.com/tajo/chessb)

## Description 

This is a game called [Bughouse Chess](https://en.wikipedia.org/wiki/Bughouse_chess) - a special variant of chess for 4 players. This project includes both server and client (web interface written in mighty [React](https://facebook.github.io/react/)). **This is still an alpha version / experiment / proof of concept.** Tests, server persistence and more features coming soon.

## Interesting technical solutions

- communication based on [Socket.io](http://socket.io/)
- [Redux](https://github.com/reactjs/redux) used on both sides (client and server), both sides can easily dispatch actions locally or remotely, thanks to [socketMiddleware.js](https://github.com/tajo/chessb/blob/master/src/common/socketMiddleware.js) and action flags:
  - `room` = server -> player(s)
  - `remote` = player -> server
  - `broadcast` = server -> all players
- every game has an unique ID and URL that is generated and refreshed/synced by the server
- all game rules are checked/enforced on both client and server - [significant chunks](https://github.com/tajo/chessb/tree/master/src/common) of code are shared between client and server
- very precise time control (in ms), clients are running their own counters but also getting array of move timestamps from the server, which is used for [synchronization](https://github.com/tajo/chessb/blob/master/src/browser/components/clock.js#L60)
- the server is pretty minimalistic (750 lines of code)
- there is one (mostly) immutable state for client and server, everything is definied as

  ```js
  (state, action) => state
  ```
- stylish drag&droping using [react-dnd](https://github.com/gaearon/react-dnd)
- babel, webpack and all other goodies... 

## Requirements

- node.js 4+
- npm 3+
- recommended: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) and [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

Make sure this works: 

```
node --version
npm --version
```

On some systems, node is installed as `nodejs`, you need to create alias `node`.

## Installation

```
git clone git@github.com:tajo/chessb.git
cd chessb
npm install
```

## Running (for developing)

```
npm start
open http://localhost:8000
```

## Build & Running (production version)

```
npm run build
NODE_ENV=production node src/server
open http://localhost:8000
```

or

```
npm run build
npm install -g forever
npm run server // using https://www.npmjs.com/package/forever
open http://localhost:8000
```

## Linting (checks the quality of code)

```
npm run lint
```

## Todo: Tests (runs test suite)

```
npm test
```

