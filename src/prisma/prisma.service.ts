import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDB() {
    return this.$transaction([
      this.bet.deleteMany(),
      this.gameRecord.deleteMany(),
      this.game.deleteMany(),
    ]);
  }

  cleanLastUser() {
    return this.$transaction([
      this.user.delete({
        where: {
          email: 'test@test.com',
        },
      }),
    ]);
  }
}
