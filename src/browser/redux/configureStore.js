import fetch from '../fetch';
import injectDependencies from '../injectDeps';
import promiseMiddleware from 'redux-promise-middleware';
import shortid from 'shortid';
import rootReducer from './reducers';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

export default function configureStore(initialState) {
  const getUid = () => shortid.generate();
  const now = () => Date.now();
  const dependenciesMiddleware = injectDependencies({fetch, getUid, now});

  const middleware = applyMiddleware(
    dependenciesMiddleware,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  );

  let createStoreWithMiddleware;
  if (process.env.NODE_ENV === 'development') {
    createStoreWithMiddleware = compose(
      middleware,
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    );
  } else {
    createStoreWithMiddleware = compose(middleware);
  }

  const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

  // Enable hot reload where available.
  if (module.hot) { // eslint-disable-line no-undef
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./reducers', () => { // eslint-disable-line no-undef
      const nextAppReducer = require('./reducers'); // eslint-disable-line no-undef
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
