import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { authenticateRequest } from './middlewares/auth';
import { errorHandler } from './middlewares/error-handler';
import { apiRouter, authRouter } from './routes';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api', authenticateRequest, apiRouter);
app.use(errorHandler);