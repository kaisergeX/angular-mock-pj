import { OmitType } from '@nestjs/mapped-types';
import { AuthDto } from './auth.dto';

export class UserDto extends OmitType(AuthDto, ['password']) {}
