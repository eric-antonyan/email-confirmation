import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    @Get("me")
    @UseGuards(JwtGuard)
    getMe(@GetUser() user: User) {
        return user
    }
}
