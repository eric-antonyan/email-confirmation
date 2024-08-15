import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from "nodemailer";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VerifyService {
    private readonly logger = new Logger(VerifyService.name)
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService,
        private readonly mailerService: MailerService
    ) { }

    async getUser(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        return user;
    }

    async confirm(req: Request) {
        const authorization = req.headers["authorization"];

        if (authorization) {
            const match = authorization.match(/^Bearer\s+(.+)$/);

            if (match) {
                const token = match[1];

                try {
                    const payload = await this.jwt.verify(token, {
                        secret: 'secret',
                    })

                    const user = await this.getUser(payload.email);

                    if (!user) throw new NotFoundException("User has been deleted")

                    console.log(user);


                    const access_token = await this.jwt.signAsync({ user }, {
                        secret: 'secret',
                        expiresIn: '60m'
                    });

                    try {
                        await this.sendEmail(user.email, "Account Verification", "Account Verification",
                            `
                        <h1 align="center">Account Verification For ${user.email}</h1>
                        <h2 align="center">Your account ID: ${user.id}</h2>
                        <center>
                            <a href="http://localhost:3000/auth/confirm?token=${access_token}&from=${token}" style="cursor: pointer">
                                <button style="padding: 12px 50px; background: #0f0; color: #fff; border-radius: 10px; border: none;">Confirm Account</button>
                            </a>
                        </center>
                        `
                        )
                    } catch (err) {
                        console.log(err);
                    }

                    return {
                        message: "sent"
                    };

                } catch (error) {
                    if (error.code === "TokenExpiredError") {
                        throw new UnauthorizedException("Token has expired")
                    } else {
                        throw new UnauthorizedException("Invalid token")
                    }
                }

            } else {
                throw new UnauthorizedException("Invalid authorization format");
            }
        } else {
            throw new UnauthorizedException()
        }
    }

    async set(req: Request) {
        const authorization = req.headers["authorization"];

        if (authorization) {
            const match = authorization.match(/^Bearer\s+(.+)$/);

            if (match) {
                const token = match[1];

                try {
                    const payload = await this.jwt.verify(token, {
                        secret: 'secret',
                    })

                    const user = await this.getUser(payload.email);

                    if (!user) throw new NotFoundException("User has been deleted")

                    console.log(user);

                    await this.prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            verified: true
                        }
                    })

                    return {
                        message: "verified"
                    };

                } catch (error) {
                    if (error.code === "TokenExpiredError") {
                        throw new UnauthorizedException("Token has expired")
                    } else {
                        throw new UnauthorizedException("Invalid token")
                    }
                }

            } else {
                throw new UnauthorizedException("Invalid authorization format");
            }
        } else {
            throw new UnauthorizedException()
        }
    }

    async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
        try {
            const info = await this.mailerService.sendMail({
                from: '"Antonyan Apps" antonyancoding@gmail.com',
                to,
                subject,
                text,
                html
            })

            this.logger.log(`Email sent: ${info.response}`)
        } catch (err) {
            this.logger.log(`Failed to send email: ${err.message}`)
        }
    }
}
