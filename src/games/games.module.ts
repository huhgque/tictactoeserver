import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameService } from './games.service';
import { Game, GameSchema } from 'src/models/Game';
import { GameController } from './games.controller';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Game.name,schema:GameSchema}]),
    ],
    controllers:[GameController],
    providers:[GameService],
    exports:[GameService]
})
export class GamesModule {

}
