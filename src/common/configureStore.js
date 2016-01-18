import fetch from './fetch';
import injectDependencies from './injectDeps';
import promiseMiddleware from 'redux-promise-middleware';
import socketMiddleware from './socketMiddleware';
import shortid from 'shortid';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

export default function configureStore(io, reducer, reduxRouterMiddleware = null) {
  const getUid = () => shortid.generate();
  const now = () => Date.now();
  const dependenciesMiddleware = injectDependencies({fetch, getUid, now});

  const middlewares = [
    socketMiddleware(io),
    dependenciesMiddleware,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  ];
  if (reduxRouterMiddleware) {
    middlewares.push(reduxRouterMiddleware);
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
      const nextAppReducer = require('../browser/redux/reducers'); // eslint-disable-line no-undef
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
