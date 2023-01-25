import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BetModule } from './bet/bet.module';
import { GameModule } from './game/game.module';
import { GameRecordModule } from './game-record/game-record.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BetModule,
    GameModule,
    GameRecordModule,
    PrismaModule,
  ],
})
export class AppModule {}
