import { logger } from '@echoing/logger';
import * as servers from './server';

function main(): void {
  logger.info('starting the server...');
  servers.run();
}

main();
