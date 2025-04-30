import express, { Express, Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error';
import { SignupSchema } from './schema/users';

const app: Express = express();
app.use(express.json());
// Use Morgan for logging
app.use(morgan('dev')); // 'dev' format gives concise logs

app.use('/api/v1/', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pinCode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pinCode}`;
        },
      },
    },
  },
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
