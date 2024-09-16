import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './users.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private userCustomRepo: UserRepository) {}

  signUp(authCredentials: AuthDto): Promise<void> {
    return this.userCustomRepo.createUser(authCredentials);
  }

  async signIn(authCredentials: AuthDto): Promise<{ accessToken: string }> {
    const accessToken =
      await this.userCustomRepo.validateCredential(authCredentials);
    return { accessToken };
  }

  async getProfile(user: UserDto): Promise<UserDto> {
    return this.userCustomRepo.getUserProfile(user.username);
  }
}
