import { Controller, Get, Req } from '@nestjs/common';
import { VerifyService } from './verify.service';

@Controller('verify')
export class VerifyController {
    constructor(
        private verifyService: VerifyService,
    ) {}

    @Get("confirm")
    confirm(@Req() req: Request) {
        return this.verifyService.confirm(req);
    }

    @Get("set")
    update(@Req() req: Request) {
        return this.verifyService.set(req);
    }
}
