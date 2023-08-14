import {Schema , Prop , SchemaFactory, raw} from "@nestjs/mongoose"
import mongoose, { Date, HydratedDocument, Types } from "mongoose"
import { User } from "./User"

@Schema()
export class Room {
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
    host:User
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User",default:null})
    player2:User
    @Prop({default:true})
    available : boolean
    createdAt:Date
    updatedAt:Date
}

export type RoomDoc = HydratedDocument<Room>

export const RoomSchema = SchemaFactory.createForClass(Room)