import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserData } from '@repo/shared';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto, JwtPayload } from './dto/auth.dto';
import { User } from './user.entity';
import { sqliteEnumErr } from '~/utils';
import { SQLITE_CONSTRAINT_MSG } from '~/constants/sqlite-err';

@Injectable()
export class UserRepository {
  #logger = new Logger('AuthController');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createUser({ username, password, confirmPassword }: AuthDto) {
    if (password !== confirmPassword) {
      throw new ConflictException('Password does not match');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepo.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepo.save(user);
      this.#logger.verbose(`User ${user.username} created`);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (sqliteEnumErr(error.message) === SQLITE_CONSTRAINT_MSG.UNIQUE) {
          throw new ConflictException('Username already exists');
        }
      }

      throw new InternalServerErrorException();
    }
  }

  async generateJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateCredential({ username, password }: AuthDto): Promise<string> {
    const user = await this.userRepo.findOneBy({ username });

    if (!user) {
      // this.#logger.error(`User ${username} not found`);
      throw new NotFoundException('Invalid username or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.generateJwtToken({ username });
  }

  async getUserData(username: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getUserProfile(username: string): Promise<UserData> {
    const user = await this.getUserData(username);
    return { username: user.username };
  }
}
