import { logger } from '@echoing/logger';
import express from 'express';
import type { Request, Response } from 'express';

export const app = express();
const PORT = process.env.HTTP_PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('farewell-service is awake!');
});

app.get('/healthz', (req: Request, res: Response) => {
  res.json({
    health: true,
  });
});

export const run = (): void => {
  app.listen(PORT, () => {
    logger.info(`server is running on http://localhost:${PORT}`);
  });
};
