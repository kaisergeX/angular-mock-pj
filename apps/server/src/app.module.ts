import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configValidator } from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      // envFilePath: [`.env.${process.env.STAGE}`],
      validate: configValidator,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
