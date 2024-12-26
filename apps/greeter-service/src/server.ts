import { logger } from '@echoing/logger';
import express from 'express';
import type { Request, Response } from 'express';
import { ContentServiceClient, createGrpcClient } from '@echoing/apis';

const SERVICE_NAME = process.env.SERVICE_NAME ?? '';
const HTTP_PORT = process.env.HTTP_PORT ?? '8080';

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`${SERVICE_NAME} is awake!`);
});

app.get('/go', async (req: Request, res: Response) => {
  const response = await createGrpcClient(ContentServiceClient).getContentById({
    id: 'greeter',
  });
  res.send(response.response.template);
});

app.get('/healthz', (req: Request, res: Response) => {
  res.json({
    health: true,
  });
});

export const run = (): void => {
  const httpListen = (port: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      app.listen(port, (err?: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const httpListener = httpListen(HTTP_PORT).then(() => {
    logger.info(`http server is running on http://localhost:${HTTP_PORT}`);
  });

  Promise.all([httpListener])
    .then(() => {
      logger.info('servers are running successfully!');
    })
    .catch((error) => {
      logger.error('error starting servers:', error);
    });
};
