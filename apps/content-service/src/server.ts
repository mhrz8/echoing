import { logger } from '@echoing/logger';
import * as grpc from '@grpc/grpc-js';
import express from 'express';
import { promisify } from 'util';
import { healthz, home } from './routes';
import { ContentService } from '@echoing/apis';
import { createDefinition } from '@protobuf-ts/grpc-backend';
import { ContentServer } from './rpc';

const SERVICE_NAME = process.env.SERVICE_NAME ?? '';
const HTTP_PORT = process.env.HTTP_PORT ?? '8080';
const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

const app = express();
const grpcApp = new grpc.Server();

app.use(express.json());

app.get('/', home(SERVICE_NAME));
app.get('/healthz', healthz());

grpcApp.addService(createDefinition(ContentService), ContentServer);

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
  const grpcListen = promisify(grpcApp.bindAsync.bind(grpcApp) as typeof grpcApp.bindAsync);

  const httpListener = httpListen(HTTP_PORT).then(() => {
    logger.info(`http server is running on http://localhost:${HTTP_PORT}`);
  });

  const grpcListener = grpcListen(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
  ).then(() => {
    logger.info(`grpc server is running on http://localhost:${GRPC_PORT}`);
  });

  Promise.all([httpListener, grpcListener])
    .then(() => {
      logger.info('servers are running successfully!');
    })
    .catch((error) => {
      logger.error('error starting servers:', error);
    });
};
