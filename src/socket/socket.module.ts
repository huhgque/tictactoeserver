import { Module } from '@nestjs/common';
import { SocketGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/models/Game';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.constants';
@Module({
    imports:[MongooseModule.forFeature([{name:Game.name,schema:GameSchema}])
    ],
    providers:[SocketGateway]
})
export class SocketModule{}