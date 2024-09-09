import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Test } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(_: Test): string {
    return this.appService.getHello();
  }
}
