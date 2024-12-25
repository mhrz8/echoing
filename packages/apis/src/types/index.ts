import type * as grpc from '@grpc/grpc-js';

export type GrpcServiceImplementation<T> = {
  [K in keyof T]: T[K] extends (request: infer Req, context: infer C) => Promise<infer Res>
    ? grpc.handleUnaryCall<Req, Res>
    : never;
};
