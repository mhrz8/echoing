import type { GetContentByIdRequest } from '@echoing/apis';
import { createGrpcHandler, GetContentByIdResponse } from '@echoing/apis';
import { logger } from '@echoing/logger';

async function processing(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export const getContentById = createGrpcHandler<GetContentByIdRequest, GetContentByIdResponse>(
  async (request, call) => {
    const template = 'Hmmm, I dont think I know what to do, {{name}}...';

    await processing(500);

    logger.info(`[getContentById] processing request: ${JSON.stringify(request)}`);
    logger.info(`[getContentById] processing metadata: ${JSON.stringify(call.metadata)}`);

    if (request.id === 'greeter') {
      return GetContentByIdResponse.create({
        template: 'Hello welcome, {{name}}!',
      });
    } else if (request.id === 'farewell') {
      return GetContentByIdResponse.create({
        template: 'See you again, {{name}}!',
      });
    }

    return GetContentByIdResponse.create({
      template,
    });
  },
);
