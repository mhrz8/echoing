import { type GrpcServiceImplementation, type IContentService } from '@echoing/apis';
import { getContentById } from './get-content-by-id';

export const ContentServer: GrpcServiceImplementation<IContentService> = {
  getContentById: getContentById,
};
