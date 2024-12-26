import { logger } from '@echoing/logger';
import express from 'express';
import { healthz, home, content } from './routes';

const SERVICE_NAME = process.env.SERVICE_NAME ?? '';
const HTTP_PORT = process.env.HTTP_PORT ?? '8080';

export const app = express();

// add express routes
app.use(express.json());
app.get('/', home(SERVICE_NAME));
app.get('/content', content());
app.get('/healthz', healthz());

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

  // spin the servers concurrently
  Promise.all([httpListener])
    .then(() => {
      logger.info('servers are running successfully!');
    })
    .catch((error) => {
      logger.error('error starting servers:', error);
    });
};
