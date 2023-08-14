import { User } from 'src/models/User';
import { UsersService } from './../users/users.service';
import { Injectable ,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { checkPassword, hashPassword } from './hash/auth.hash';
import { SignOnDTO } from './dto/signon.dto';
import { UserCreateDto } from 'src/users/dto/user-create.dto';

@Injectable()
export class AuthService {
    constructor (
        private userService:UsersService,
        private jwtService : JwtService
    ){}
    async signIn(email:string,password:string){
        const user:User = await this.userService.findOne(email)
        if(!user){
            throw ({message : "User not exist"})
        }
        if(!await checkPassword(password,user.password)){
            throw new UnauthorizedException()
        }
        const payload = { sub: user._id, userEmail: user.email,displayName:user.displayName };
        return { access_token : await this.jwtService.signAsync(payload) }
    }
    async signOn(signOnDto:UserCreateDto){
        try{
            signOnDto.password = await hashPassword(signOnDto.password)
            return this.userService.createOne(signOnDto)
        }catch (e) {
            throw e
        }
    }
}
