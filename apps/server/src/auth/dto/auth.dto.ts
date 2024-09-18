import { LoginRequest, UserSchema } from '@repo/shared';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto implements LoginRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'Password too weak',
  //   })
  password: string;

  @IsString()
  @IsOptional()
  confirmPassword?: string;
}

export type JwtPayload = Pick<UserSchema, 'username'>;
