import {Schema , Prop , SchemaFactory} from "@nestjs/mongoose"
import { Date, HydratedDocument, Types } from "mongoose"

@Schema({timestamps:true})
export class User {
    
    _id:Types.ObjectId
    @Prop()
    displayName:string
    @Prop({required:true})
    userName:string
    @Prop({required:true,unique:true})
    email:string
    @Prop({required:true})
    password:string
    @Prop({default:""})
    avata:string
    createdAt:Date
    updatedAt:Date
}

export type UserDoc = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)