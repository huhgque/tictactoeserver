import {Schema , Prop , SchemaFactory, raw} from "@nestjs/mongoose"
import mongoose, { HydratedDocument, Types } from "mongoose"
import { User } from "./User"
import { Turn } from "./Turn"

@Schema()
export class Game {
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
    player1:User
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
    player2:User
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
    moveFirst:User
    @Prop({})
    startDate:Date
    @Prop()
    endDate:Date
    @Prop({default:1})
    turn:number
    @Prop(raw([{
        turn : {type:Number},
        xCord : {type:Number},
        yCord : {type:Number},
        player : {type:Types.ObjectId,ref:"User"}
    }]))
    turns:Turn[]
    @Prop({default:false})
    hasFinish : boolean
}

export type GameDoc = HydratedDocument<Game>

export const GameSchema = SchemaFactory.createForClass(Game)
