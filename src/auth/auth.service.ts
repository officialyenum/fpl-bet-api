import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: AuthDto) {
    console.log(dto);
    return { message: 'I have  logged in' };
  }

  async register(dto: RegisterDto) {
    //  generate the password
    const hash = await argon.hash(dto.password);
    // save the new user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        roleId: 1,
      },
    });
    delete user.password;
    // return Registered user
    return { message: 'User Registered', data: user };
  }
}
