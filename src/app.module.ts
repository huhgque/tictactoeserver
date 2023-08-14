import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesModule } from './games/games.module';
import { RoomModule } from './rooms/room.module';

@Module({
  imports: [SocketModule, AuthModule, UsersModule , GamesModule, RoomModule,
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/TicTacToe",{
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
