import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, JwtPayload } from './dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthData, UserData } from '@repo/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authCredentials: AuthDto) {
    return this.authService.signUp(authCredentials);
  }

  @Post('signin')
  signIn(@Body() authCredentials: AuthDto): Promise<AuthData> {
    return this.authService.signIn(authCredentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }): Promise<UserData> {
    return this.authService.getProfile(req.user);
  }
}
