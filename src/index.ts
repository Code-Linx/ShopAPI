import express, { Express, Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes';

const app: Express = express();
app.use('/api/v1/', rootRouter);

app.listen(PORT, () => {
  console.log('App Working!');
});
