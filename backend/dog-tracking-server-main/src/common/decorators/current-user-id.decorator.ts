// src/common/decorators/current-user-id.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Types } from 'mongoose';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): Types.ObjectId => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID is missing from context');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    return new Types.ObjectId(userId);
  },
);
