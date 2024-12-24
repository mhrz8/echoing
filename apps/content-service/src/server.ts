import { logger } from '@echoing/logger';
import express from 'express';
import type { Request, Response } from 'express';

const serviceName = process.env.SERVICE_NAME;
const PORT = process.env.HTTP_PORT;

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`${serviceName} is awake!`);
});

app.get('/healthz', (req: Request, res: Response) => {
  res.json({
    health: true,
  });
});

export const run = (): void => {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
};
