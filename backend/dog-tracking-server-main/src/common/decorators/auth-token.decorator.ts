import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.getArgByIndex(2);
    const req = context?.req;
    if (!req) {
      throw new Error('Request object not found in GraphQL context');
    }

    return req.headers['authorization'] || req.headers['Authorization'];
  },
);
