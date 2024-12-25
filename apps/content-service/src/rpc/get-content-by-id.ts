import type { GetContentByIdRequest } from '@echoing/apis';
import { createGrpcHandler, GetContentByIdResponse } from '@echoing/apis';
import { logger } from '@echoing/logger';

export const getContentById = createGrpcHandler<GetContentByIdRequest, GetContentByIdResponse>(
  async (request, call) => {
    logger.info(`Request received: ${JSON.stringify(request)}`);

    logger.info(`Headers: ${JSON.stringify({ meta: call.metadata })}`);

    await new Promise((res) => setTimeout(res, 10));

    const name: string = request.id ?? 'World';

    return GetContentByIdResponse.create({
      template: `Hello, ${name}`,
    });
  },
);
