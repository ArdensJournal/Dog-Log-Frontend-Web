import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext()?.req;
    const info = gqlCtx.getInfo();
    const operationName =
      info?.operationName || info?.fieldName || `$Http request - ${req.url}`;

    return next.handle().pipe(
      tap((response) => {
        const timeTaken = Date.now() - now;
        this.logger.log({
          operationName,
          timeTaken,
          response,
        });
      }),
      catchError((error) => {
        const timeTaken = Date.now() - now;
        this.logger.error(
          `Operation ${operationName} failed after ${timeTaken}ms`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
