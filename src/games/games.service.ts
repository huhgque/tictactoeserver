import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/models/Game';

@Injectable()
export class GameService {
    constructor (
        @InjectModel(Game.name) private gameModel:Model<Game>
    ){}
    
    async findAll(option?:{sort:string,filter:any,take:number}){
        return this.gameModel.find()
    }
    async findOne(id):Promise<Game>{
        return await this.gameModel.findOne({_id:id})
    }
    async createOne(userDto ){
        
    }
}
