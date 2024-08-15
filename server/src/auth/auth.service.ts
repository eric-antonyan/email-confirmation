import { BadGatewayException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'console';
import { UserDto } from 'src/dto/userDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }
    async signUp(dto: UserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: dto.password
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                }
            });

            return user;
        } catch (err: unknown) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new ConflictException('Credentials taken')
                }
            }
        }
    }

    async generateToken(id: number, email: string) {
        const payload = {
            sup: id,
            email,
        }
        const token = await this.jwt.signAsync(payload, {
            expiresIn: "60m",
            secret: this.config.get("JWT_SECRET")
        });

        return token;
    }

    async signIn(dto: UserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        console.log(user);
        

        if (!!!user) throw new ForbiddenException("Credentials taken")

        const pwMatches = user.password === dto.password;

        if (!pwMatches) return;

        const access_token = await this.generateToken(user.id, user.email);

        return { access_token };

    }
}
