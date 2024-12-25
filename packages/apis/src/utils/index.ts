import type * as grpc from '@grpc/grpc-js';

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
