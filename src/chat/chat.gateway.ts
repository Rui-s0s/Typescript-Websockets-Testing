import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  JoinRoomPayload,
  SendMessagePayload,
} from './chat.types';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: JoinRoomPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.room);

    client.emit('joinedRoom', payload.room);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
  ) {
    const message = this.chatService.createMessage(payload);

    this.server
      .to(payload.room)
      .emit('newMessage', message);
  }
}
