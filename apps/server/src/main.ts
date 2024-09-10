import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './interceptors';

async function bootstrap() {
  const logger = new Logger('Application');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: 'http://localhost:4200',
    // origin: (origin, cb) => {
    //   console.log(origin);
    //   cb(new Error('Not allowed by CORS'));
    // },
    credentials: true,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const serverPort = configService.get('SERVER_PORT') || 3000;
  await app.listen(serverPort);
  logger.log(`Application listening on port ${serverPort}`);
}
bootstrap();
