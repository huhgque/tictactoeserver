import { InjectModel } from "@nestjs/mongoose";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer , OnGatewayConnection , OnGatewayDisconnect ,ConnectedSocket} from "@nestjs/websockets";
import mongoose, { Model, Mongoose } from "mongoose";
import { Server, Socket } from "socket.io";
import { Game } from "src/models/Game";
import { Turn } from "src/models/Turn";
import { PlayerMoveDTO } from "./dto/playermove.tdo";
import { HttpStatus, Req, Res, UseGuards ,ExecutionContext } from "@nestjs/common";
import { AuthWsGuard } from "src/auth/auth.ws.guard";
import { SocketUser } from "./customSocket";
import { JwtService } from "@nestjs/jwt";
import { json } from "stream/consumers";

@UseGuards(AuthWsGuard) 
@WebSocketGateway({cors:{
    origin:"*"
},namespace:"game-socket"})
export class SocketGateway implements OnGatewayConnection,OnGatewayDisconnect{
    
    @WebSocketServer()
    server : Server
    constructor(
        @InjectModel(Game.name) private gameModel : Model<Game>,
        private jwtService: JwtService
    ){
    }
    handleConnection(client:SocketUser,data:any){
        let game = new this.gameModel({})
        try{
            let token = client.handshake?.auth?.token?._j
            if(!token) token = client.handshake.headers.access_token
            console.log(token);
            const verify = this.jwtService.verify(token)
        }catch (error) {
            console.log(error);
            // client.emit("disconnect","Invalid token")
            client.disconnect(true)
        }
    }

    handleDisconnect(client: Socket) {
        console.log("client "+client.id + " disconected");
    }

    @SubscribeMessage("getGame")
    handleEventMessage(
        @MessageBody() data:string,
        @ConnectedSocket() socket: Socket,
    ):string{
        console.log(data);
        const user = socket.handshake.query.user 
        const gameId = JSON.parse(data).gameId
        const adapt:any = this.server.adapter
        const room = adapt.rooms.get(gameId)
        if(room){
            console.log("Nontify other user");
            this.server.in(gameId).emit("playerConnect",JSON.stringify(user))
        }
        socket.join(gameId)
        return undefined
    }
    @SubscribeMessage("playerMove")
    async handleEventPlayerMove( 
        @MessageBody() data : any,
        @ConnectedSocket() socket: any,
    ){
        const move:PlayerMoveDTO = JSON.parse(data)
        console.log(move);
        try{
            let game = await this.gameModel.findById(new mongoose.Types.ObjectId(move.gameId)).orFail().exec()
            if(game.turns.length > 0 && game.turns[game.turns.length - 1].player == move.userId){
                return "Invalid move";
            }
            let turn = new Turn()
            turn.xCord = move.xCord
            turn.yCord = move.yCord
            turn.turn = game.turn
            turn.player = move.userId
            let isGameFinish = this.checkWin(turn,game.turns)
            game.turns.push(turn)
            if(isGameFinish){
                game.hasFinish = true
                this.server.in(game.id).emit("gameStateChange",`Player ${turn.player} has won`)
            }
            game.save()
            this.server.in(game.id).emit("playerMove",JSON.stringify(turn))
            return JSON.stringify(game)
        }catch (e){
            console.log(e);
        }
        return "Huh?"
    }

    private checkWin(move:Turn,turns:Turn[]){
        let check = [-1,0,1]
        for(let x = 0; x < check.length ; x++ ) {
            let xCord = check[x]
            for(let y = 0; y < check.length ; y++ ) {
                let yCord = check[y]
                if(xCord == 0 && yCord == 0) return
                console.log(`Move vec : (${xCord},${yCord})`);
                let userAtCheck = this.checkNext(xCord,yCord,move,turns,1,3)
                console.log(userAtCheck);
                if(userAtCheck) {
                    return true
                }
            }
        } 
        return false
    }
    private checkNext(xCord,yCord,move:Turn,turns:Turn[],currentStrike,maxStrike){
        let checkXcord = move.xCord + xCord*(currentStrike)
        let checkYcord = move.yCord + yCord*(currentStrike)
        console.log(`Check : ${checkXcord},${checkYcord}\nStrike : ${currentStrike}`);
        let findNext = turns.find(x => x.xCord == checkXcord && x.yCord == checkYcord && x.player == move.player)
        if(findNext){
            if(currentStrike + 1 == maxStrike)
                return true
            return this.checkNext(xCord,yCord,move,turns,currentStrike+1,maxStrike)
        }
        else{
            return false
        }

    }
}