import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  JoinRoomPayload,
} from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatService: ChatService, 
    private readonly eventEmitter: EventEmitter2
  ) {}

  handleConnection(client: Socket) {
    // Dont do anything, maybe console.log client.id for debug
  }

  handleDisconnect(client: Socket) {
    // One single call to get data and clean up state
    const userData = this.chatService.removeUserBySocket(client.id);
    
    if (!userData) return;

    const { room, username } = userData;
    const count = this.chatService.getUserCount(room);

    // Delegate to EventEmitter (Logic/Broadcasting happens in the Listener)
    this.eventEmitter.emit('user.left', { 
      room, 
      username, 
      count 
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: JoinRoomPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.room);

    this.chatService.addUserToRoom(payload.room, payload.username, client.id);

    const count = this.chatService.getUserCount(payload.room);

    this.server.to(payload.room).emit('userCount', { count });
  }    

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: SendMessageDto) {

    const preparedMsg = this.chatService.prepareMessage(data);

    this.server.to(data.room).emit('newMessage', preparedMsg);

}
}