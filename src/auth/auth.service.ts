import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist
    if (!user) throw new NotFoundException(`User with ${dto.email} Not Found`);
    const pwMatches = await argon.verify(user.password, dto.password);
    // if password does not match
    if (!pwMatches) throw new ForbiddenException('Password Incorrect');
    //delete password
    // return Logged in user Token
    return this.signToken(user.id, user.email);
  }

  async register(dto: RegisterDto) {
    try {
      //  hash the password
      const hash = await argon.hash(dto.password);
      // save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          roleId: 1,
        },
      });
      // return Registered user Token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
