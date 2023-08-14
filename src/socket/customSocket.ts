import { Socket,Handshake } from "socket.io/dist/socket";
import { User } from "src/models/User";

interface handshakeUser extends Handshake{
    user?:User
}
export class SocketUser extends Socket{
    handshake:handshakeUser
}
