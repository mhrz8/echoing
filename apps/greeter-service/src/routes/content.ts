import { ContentServiceClient, createGrpcClient } from '@echoing/apis';
import type { Request, Response } from 'express';

export function content(): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response) => {
    const response = await createGrpcClient(ContentServiceClient).getContentById({
      id: 'greeter',
    });
    res.send(response.response.template);
  };
}
