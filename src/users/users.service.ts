import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/User';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UsersService {
    constructor (
        @InjectModel(User.name) private userModel:Model<User>
    ){}
    
    async findAll(option?:{sort:string,filter:any,take:number}){
        return this.userModel.find()
    }
    async findOne(email):Promise<User>{
        return await this.userModel.findOne({email:email})
    }
    async createOne(userDto : UserCreateDto){
        try{
            let user = new this.userModel(userDto)
            if( (await this.userModel.find({email:user.email})).length > 0 ){
                throw ({message : "Email exist"})
            }
            if(user.displayName.trim().length == 0) user.displayName = user.userName
            user.save()
            return user
        }catch(e){
            throw(e)
        }
    }
}
