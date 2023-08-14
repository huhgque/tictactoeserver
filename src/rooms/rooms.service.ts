import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/models/Room';
import { Model } from 'mongoose';
import { User } from 'src/models/User';
@Injectable()
export class RoomService{
    constructor(
        @InjectModel(Room.name) private roomModel:Model<Room>,
        @InjectModel(User.name) private userModel:Model<User>
    ){}
    findAll(){
        return this.roomModel.find({player2:null})
    }
    createOne(user:User){
        let room = new this.roomModel()
        room.host = user
        room.save()
        return room
    }
    joinOne(roomId:string,player2:User){
        let find = this.roomModel.findOne({_id:roomId})
        if(find){
            this.roomModel.updateOne({_id:roomId},{player2:player2})
            return true
        }
        return false
    }
    
    async leaveOne(roomId:string,player2:User){
        let find = await this.roomModel.findById(roomId)
        if(find){
            this.roomModel.updateOne({_id:roomId},{player2:player2})
            if(find.host == player2){
                this.roomModel.deleteOne({_id:roomId})
            }
            return true
        }
        return false
    }
}