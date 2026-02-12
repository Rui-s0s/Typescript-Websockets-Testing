import { ChatMessage } from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  // Use the Interface for internal storage blueprint
  private readonly messages: ChatMessage[] = [];
  private rooms = new Map<string, Set<string>>();
  private socketMap = new Map<string, { room: string; username: string }>();
  constructor(
    @Inject(forwardRef(() => ChatGateway)) // <--- Fixes circular dependency
    private readonly chatGateway: ChatGateway,
  ) {}

  addUserToRoom(room: string, username: string, socketId: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    this.rooms.get(room)!.add(username);
    this.socketMap.set(socketId, { room, username });
  }

  removeUserBySocket(socketId: string): { room: string, username: string } | null {
    const entry = this.socketMap.get(socketId);
    if (!entry) return null;

    const { room, username } = entry;

    // Perform the deletions
    this.rooms.get(room)?.delete(username);
    this.socketMap.delete(socketId);

    // Return the data we captured BEFORE the delete
    return { room, username };
  }

  getUserBySocket(socketId: string): {room: string, username: string} | null  { // NOT USED YET
    const entry = this.socketMap.get(socketId);
    if (!entry) return null;
    return entry;
  }

  getUserCount(room: string): number {
    return this.rooms.get(room)?.size ?? 0;
  }

  prepareMessage(dto: SendMessageDto): ChatMessage {
    const newMessage: ChatMessage = {
      ...dto,
      timestamp: Date.now(), 
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }

  @OnEvent('user.left')
  handleUserLeft(payload: { room: string, username: string, count: number }) {
    const { room, username, count } = payload;

    // Use this.chatGateway.server to reach the sockets
    this.chatGateway.server.to(room).emit('userCount', { count });

    this.chatGateway.server.to(room).emit('userStatusUpdate', {
      message: `${username} has disconnected`,
      type: 'LEAVE',
      username
    });
  }

  resetState() {
    this.socketMap.clear();
    this.rooms.clear();
  }
}


