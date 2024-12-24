import { logger } from '@echoing/logger';
import * as servers from './server';

const serviceName = process.env.SERVICE_NAME;

function main(): void {
  logger.info(`starting the ${serviceName} server...`);
  servers.run();
}

main();
