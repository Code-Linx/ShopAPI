import express, { Express, Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error';

const app: Express = express();
app.use(express.json());
// Use Morgan for logging
app.use(morgan('dev')); // 'dev' format gives concise logs

app.use('/api/v1/', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`App runnning on port ${PORT}`);
});
