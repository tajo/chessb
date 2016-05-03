import {get, post, put, remove} from '../common/fetch';
import promiseMiddleware from 'redux-promise-middleware';
import socketMiddleware from './socketMiddleware';
import shortid from 'shortid';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

export default function configureStore(io, reducer, browserMiddlewares = null) {
  // Remember to set SERVER_URL for deployment.
  const SERVER_URL = process.env.SERVER_URL ||
    (process.env.IS_BROWSER ? '' : 'http://localhost:8000');

  const injectMiddleware = deps => store => next => action =>
    next(typeof action === 'function'
      ? action({...deps, store})
      : action
    );

  let middlewares = [
    socketMiddleware(io),
    injectMiddleware({
      get: get(SERVER_URL),
      post: post(SERVER_URL),
      remove: remove(SERVER_URL),
      put: put(SERVER_URL),
      getUid: () => shortid.generate(),
      now: () => new Date().toISOString(),
    }),
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  ];
  if (browserMiddlewares) {
    middlewares = middlewares.concat(browserMiddlewares);
  }
  const middleware = applyMiddleware.apply(this, middlewares);
  let createStoreWithMiddleware;
  if (process.env.NODE_ENV === 'development') {
    createStoreWithMiddleware = compose(
      middleware,
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    );
  } else {
    createStoreWithMiddleware = compose(middleware);
  }

  const store = createStoreWithMiddleware(createStore)(reducer);

  // Enable hot reload where available.
  if (module.hot) { // eslint-disable-line no-undef
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('../browser/redux/reducers', () => { // eslint-disable-line no-undef
      /* eslint-disable */
      const nextAppReducer = require('../browser/redux/reducers'); // eslint-disable-line no-undef
      /* eslint-enable */
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
