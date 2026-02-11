import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
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

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
  const room = this.chatService.removeUserBySocket(client.id);

  if (!room) return;

  const count = this.chatService.getUserCount(room);

  this.server.to(room).emit('userCount', { count });
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

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: SendMessageDto) {

    const preparedMsg = this.chatService.prepareMessage(data);

    this.server.to(data.room).emit('newMessage', preparedMsg);

}}