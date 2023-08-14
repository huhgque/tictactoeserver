import { Controller,Get, Param , Post , Body , Res , HttpStatus, Req , UseGuards} from '@nestjs/common';
import { GameService } from './games.service';
import { Request, Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('games')
export class GameController {
    constructor(
        private gameService:GameService
    ){}
    @Get()
    findAll(){
        console.log("get all");
        return this.gameService.findAll()
    }
    @Get('find-one/:gameId')
    async findOne(@Param('gameId') gameid : string,@Res() res:Response){
        const data = await this.gameService.findOne(gameid)
        if(data){
            return res.status(200).json(data)
        }
        return res.status(HttpStatus.NO_CONTENT)
    }
    @UseGuards(AuthGuard)
    @Get("user-info")
    async getCurrentUser(@Req() req:Request,@Res() res:Response){
        try{
            const payload = req['user']
            const email:string = payload.userEmail
            const user = await this.gameService.findOne(email)
            return res.status(HttpStatus.OK).json(user)
        }catch (e){
            return res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).json({message:"Fail to authentication"})
        }
    }

    private GetToken(req:Request){
        const [type,token] = req.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined;
    }
}       
