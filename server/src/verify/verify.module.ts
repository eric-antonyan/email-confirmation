import { Module } from '@nestjs/common';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerModule } from "@nestjs-modules/mailer"
import { GOOGLE_PASS, GOOGLE_SMTP, GOOGLE_USER } from '../auth/constants';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: GOOGLE_SMTP,
        auth: {
          user: GOOGLE_USER,
          pass: GOOGLE_PASS
        }
      }
    })
  ],
  controllers: [VerifyController],
  providers: [VerifyService, JwtService, PrismaService]
})
export class VerifyModule { }
