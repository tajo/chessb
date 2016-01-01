import compression from 'compression';
import device from 'express-device';
import express from 'express';
import render from './render';

const app = express();

app.use(compression());

app.use('/assets', express.static('assets', {maxAge: '200d'}));
app.use('/_assets', express.static('build', {maxAge: '200d'}));

app.use(device.capture());
app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
