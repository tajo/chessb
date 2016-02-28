import Html from './Html.react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import getAppAssetFilenamesAsync from './assets';
// import configureStore from '../../browser/redux/configureStore';
import serialize from 'serialize-javascript';
import {HOT_RELOAD_PORT} from '../../../webpack/constants';

export default function render(req, res) {
  // const store = configureStore();
  const store = {};
  const html = renderPage(store, req);
  res.send(html);
}

function renderPage(store, req) { // eslint-disable-line space-before-function-paren
  // const clientState = store.getState();
  const clientState = store;
  const {headers, hostname} = req;
  const {
    css: appCssFilename,
    js: appJsFilename
  } = getAppAssetFilenamesCachedAsync();
  const scriptHtml = getScriptHtml(clientState, headers, hostname, appJsFilename);

  return `<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyHtml={`<div id="app"></div>${scriptHtml}`}
      googleAnalyticsId={config.googleAnalyticsId}
      isProduction={config.isProduction}
    />
  )}`;
}

let appAssetFilenameCache = null;
function getAppAssetFilenamesCachedAsync() { // eslint-disable-line space-before-function-paren
  if (appAssetFilenameCache) return appAssetFilenameCache;
  appAssetFilenameCache = getAppAssetFilenamesAsync();
  return appAssetFilenameCache;
}

function getScriptHtml(clientState, headers, hostname, appJsFilename) {
  const appScriptSrc = config.isProduction
    ? `/_assets/${appJsFilename}`
    : `//${hostname}:${HOT_RELOAD_PORT}/build/app.js`;

  // Note how clientState is serialized. JSON.stringify is anti-pattern.
  // https://github.com/yahoo/serialize-javascript#user-content-automatic-escaping-of-html-characters
  return `
    <script>
      window.__INITIAL_STATE__ = ${serialize(clientState)};
    </script>
    <script src="${appScriptSrc}"></script>
  `;
}
