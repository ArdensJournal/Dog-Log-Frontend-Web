import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { LoggingInterceptor } from './common/interceptors/logging-interceptor ';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = process.env.NODE_ENV || 'production';

  // Use ALLOWED_ORIGINS from .env
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
  Logger.log(`This is the allowed origins: ${allowedOrigins}`, 'Main');
  app.enableCors({
    origin: allowedOrigins,
    methods: ['POST', 'GET'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-apollo-operation-name',
    ],
    credentials: true,
  });

  if (env === 'development') {
    app.useLogger(['log', 'debug', 'error', 'warn']);
  } else {
    app.useLogger(['error', 'warn']);
  }
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 5,
      overrideSendResponse: false, // This is necessary for nest.js/koa.js
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();