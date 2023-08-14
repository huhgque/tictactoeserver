import { JwtService } from '@nestjs/jwt';
import { Injectable , CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express'
import { jwtConstants } from './auth.constants';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor (
        private jwtService : JwtService
    ){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const req = context.switchToHttp().getRequest()
        const token = this.GetToken(req)
        if(!token){
            throw new UnauthorizedException()
        }
        console.log("Loging in with token : " + token);
        try{
            const payload = await this.jwtService.verifyAsync(token)
            req['user']=payload
            
        } catch (error) {
            throw new UnauthorizedException()
        }
        return true
    }
    private GetToken(req:Request){
        const [type,token] = req.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined;
    }
}