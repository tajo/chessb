import bodyParser from 'body-parser';
import express from 'express';
import user from './user';

const app = express();

app.use(bodyParser.json());

app.use(user);

app.on('mount', () => {
  console.log('Api is available at %s', app.mountpath);
});

export default app;
