import { Controller,Get, Param , Post , Body , Res , HttpStatus, Req , UseGuards} from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard';
import { RoomService } from './rooms.service';
import { User } from 'src/models/User';
import { UsersService } from 'src/users/users.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import mongoose from 'mongoose';


@UseGuards(AuthGuard)
@Controller('rooms')
export class RoomController {
    constructor(
        private roomService:RoomService,
        private userService:UsersService
    ){}
    
    @Get()
    async findAll(@Res() res:Response){
        const data = await this.roomService.findAll()
        return res.status(200).json(data)
    }
    @Get('find-one/:gameId')
    async findOne(@Param('gameId') gameid : string,@Req() req:Request,@Res() res:Response){
        let payload = req['user']
        if(this.roomService.joinOne(gameid,payload))
        return res.status(HttpStatus.CREATED).json("Join success")
    }
    @Post()
    async createOne(@Req() req:Request,@Res() res:Response){
        let payload = req['user']
        let user = await this.userService.findOne(payload.userEmail)
        let room = this.roomService.createOne(user)
        return res.status(HttpStatus.CREATED).json(user._id)
    }
}       
