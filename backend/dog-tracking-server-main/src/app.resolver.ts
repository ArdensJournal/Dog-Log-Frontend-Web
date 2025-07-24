// app.resolver.ts
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Resolver('')
export class AppResolver {
  // @UseGuards(AuthGuard('local'))
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
