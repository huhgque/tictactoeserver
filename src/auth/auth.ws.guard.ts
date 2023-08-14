import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express'
import { jwtConstants } from './auth.constants';
import { SocketUser } from 'src/socket/customSocket';
@Injectable()
export class AuthWsGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: SocketUser = context.switchToWs().getClient()
        try {
            let token = client.handshake?.auth?.token?._j
            if(!token) token = client.handshake.headers.access_token
            if (!token) {
                console.log("No token");
                throw new UnauthorizedException()
            }
            console.log("Loging in with token : " + token);
            const payload = await this.jwtService.verifyAsync(token)
            client.handshake.query.user = payload
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException()
        }
        return true
    }
    private GetToken(req: Request) {
        const [type, token] = req.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined;
    }
}