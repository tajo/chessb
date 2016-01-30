# ChessB

[![Build Status](https://travis-ci.com/tajo/chessb.svg?token=qkyETBiTXs35GEgJTPM5&branch=master)](https://travis-ci.com/tajo/chessb)

## Requirements

- node.js 4+
- npm 3+

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

