import Html from './Html.react';
import Promise from 'bluebird';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import getAppAssetFilenamesAsync from './assets';
import configureStore from '../../browser/redux/configureStore';
import serialize from 'serialize-javascript';
import useragent from 'useragent';
import {HOT_RELOAD_PORT} from '../../../webpack/constants';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {RoutingContext, match} from 'react-router';
import {createMemoryHistory} from 'history';

export default function render(req, res, next) {
  const store = configureStore();
  const html = renderPageAsyncNo(store, req);
  res.send(html);
}

function renderPageAsyncNo(store, req) { // eslint-disable-line space-before-function-paren
  const clientState = store.getState();
  const {headers, hostname} = req;
  const {
    css: appCssFilename,
    js: appJsFilename
  } = getAppAssetFilenamesCachedAsync();
  const scriptHtml = getScriptHtml(clientState, headers, hostname, appJsFilename);

  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyHtml={`<div id="app"></div>${scriptHtml}`}
      googleAnalyticsId={config.googleAnalyticsId}
      isProduction={config.isProduction}
    />
  );
}

let appAssetFilenameCache = null;
function getAppAssetFilenamesCachedAsync() { // eslint-disable-line space-before-function-paren
  if (appAssetFilenameCache) return appAssetFilenameCache;
  appAssetFilenameCache = getAppAssetFilenamesAsync();
  return appAssetFilenameCache;
}

function getScriptHtml(clientState, headers, hostname, appJsFilename) {
  let scriptHtml = '';

  const ua = useragent.is(headers['user-agent']);
  const needIntlPolyfill = ua.safari || (ua.ie && ua.version < '11');
  if (needIntlPolyfill) {
    scriptHtml += `
      <script src="/node_modules/intl/dist/Intl.min.js"></script>
      <script src="/node_modules/intl/locale-data/jsonp/en-US.js"></script>
    `;
  }

  const appScriptSrc = config.isProduction
    ? `/_assets/${appJsFilename}`
    : `//${hostname}:${HOT_RELOAD_PORT}/build/app.js`;

  // Note how clientState is serialized. JSON.stringify is anti-pattern.
  // https://github.com/yahoo/serialize-javascript#user-content-automatic-escaping-of-html-characters
  return scriptHtml + `
    <script>
      window.__INITIAL_STATE__ = ${serialize(clientState)};
    </script>
    <script src="${appScriptSrc}"></script>
  `;
}
