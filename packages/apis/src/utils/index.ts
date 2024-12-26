import * as grpc from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RpcTransport } from '@protobuf-ts/runtime-rpc';
import { kebabCase } from 'case-anything';

export const DAPR_PORT = 50099;

export function createGrpcHandler<Request, Response>(
  handler: (request: Request, call: grpc.ServerUnaryCall<Request, Response>) => Promise<Response>,
): grpc.handleUnaryCall<Request, Response> {
  return (call, callback) => {
    void (async (): Promise<void> => {
      try {
        const response = await handler(call.request, call);
        callback(null, response);
      } catch (error) {
        callback(error as grpc.ServiceError, null);
      }
    })();
  };
}

export function createGrpcClient<T extends new (transport: RpcTransport) => InstanceType<T>>(
  Client: T,
): InstanceType<T> {
  const appId = kebabCase(Client.name.slice(0, Client.name.indexOf('ServiceClient')));

  const transport = new GrpcTransport({
    host: `localhost:${DAPR_PORT}`,
    channelCredentials: grpc.ChannelCredentials.createInsecure(),
    meta: { 'dapr-app-id': appId },
  });

  const client = new Client(transport);

  return client;
}
