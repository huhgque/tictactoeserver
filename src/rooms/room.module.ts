import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/User';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.constants';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { Room, RoomSchema } from 'src/models/Room';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Room.name,schema:RoomSchema}]),
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        UsersModule
    ],
    controllers:[RoomController],
    providers:[RoomService],
    exports:[]
})
export class RoomModule {

}
