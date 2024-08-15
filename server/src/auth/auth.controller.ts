import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/userDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    @HttpCode(HttpStatus.OK)
    @Post("signUp")
    signUp(@Body() dto: UserDto) {
        return this.authService.signUp(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post("signIn")
    signIn(@Body() dto: UserDto) {
        return this.authService.signIn(dto)
    }
}
