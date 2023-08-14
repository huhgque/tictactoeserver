import { Controller,Get, Param , Post , Body , Res , HttpStatus, Req , UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { jwtConstants } from 'src/auth/auth.constants';
import { UserInfoDTO } from './dto/user-info.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService:UsersService,
        private jwtService:JwtService
    ){}
    @Get()
    findAll(){
        console.log("get all");
        return this.userService.findAll()
    }
    @Get('find-one/:userName')
    async findOne(@Param('userName') userName : string){
        return this.userService.findOne(userName)
    }
    @UseGuards(AuthGuard)
    @Get("user-info")
    async getCurrentUser(@Req() req:Request,@Res() res:Response){
        try{
            const payload = req['user']
            const email:string = payload.userEmail
            const user = await this.userService.findOne(email)
            return res.status(HttpStatus.OK).json(user)
        }catch (e){
            console.log(e);
            return res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).json({message:"Fail to authentication"})
        }
    }

    private GetToken(req:Request){
        const [type,token] = req.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined;
    }
}       
