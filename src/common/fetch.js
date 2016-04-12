import URI from 'urijs';
import isomorphicFetch from 'isomorphic-fetch';

function ensureServerUrl(serverUrl, input) {
  if (typeof input !== 'string') return input;
  if (URI(input).is('absolute')) return input;
  return URI(serverUrl + input).normalize().toString();
}

function createMethod(serverUrl, input, method, payload) {
  return isomorphicFetch(ensureServerUrl(serverUrl, input), {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function get(serverUrl) {
  return (input) => isomorphicFetch(ensureServerUrl(serverUrl, input));
}

export function post(serverUrl) {
  return (input, payload) => createMethod(serverUrl, input, 'POST', payload);
}

export function remove(serverUrl) {
  return (input, payload) => createMethod(serverUrl, input, 'DELETE', payload);
}

export function put(serverUrl) {
  return (input, payload) => createMethod(serverUrl, input, 'PUT', payload);
}
