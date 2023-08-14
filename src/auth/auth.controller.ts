import { Body, Controller, Post , Res , HttpStatus} from '@nestjs/common';
import { SignInDTO } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserCreateDto } from 'src/users/dto/user-create.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private authService : AuthService
    ){}

    @Post("/login")
    async signIn(@Body() signindto:SignInDTO, @Res() res : Response ){
        console.log(signindto);
        try{
            let token = await this.authService.signIn(signindto.email,signindto.password)
            return res.status(HttpStatus.CREATED).json(token)
        }catch (e) {
            return e
        }
    }
    @Post("/register")
    signOn(@Body() signOnDto:UserCreateDto){
        return this.authService.signOn(signOnDto)
    }
}
