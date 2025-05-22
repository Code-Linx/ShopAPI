import express, { Express, Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error';
import { SignupSchema } from './schema/users';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const app: Express = express();

app.use(express.json());

// ✅ Security middlewares
app.use(helmet()); // Sets various HTTP headers to secure app
app.use(
  cors({
    /* origin: ['https://yourfrontend.com'],
    credentials: true, */
  })
); // Enables CORS
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  })
);

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 3,
  message: 'Too many requests, please try again after 3 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
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

// Example vulnerable-like route (for testing only)
app.get('/test-users', async (req: Request, res: Response) => {
  const { email } = req.query;

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email as string,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
