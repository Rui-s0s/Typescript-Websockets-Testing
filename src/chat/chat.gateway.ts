import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  JoinRoomPayload,
  SendMessagePayload,
} from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({cors: { origin: '*' }})
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

  // This activates the validation
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: SendMessageDto) {
    // If the data doesn't match the DTO, this code won't even run!
    this.server.to(data.room).emit('newMessage', data);
  }
}

