import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from './user/user.module';
import { VerifyModule } from './verify/verify.module';
import { JWT_SECRET } from './auth/constants';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '60m'
      },
      global: true
    }),
    PrismaModule,
    UserModule,
    VerifyModule,
  ],
})
export class AppModule { }
