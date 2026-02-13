import { ChatMessage } from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatGateway } from './chat.gateway';
import { randomUUID } from 'crypto'; // THIS FOR UNIQUENESS


@Injectable()
export class ChatService {

  private readonly messages: ChatMessage[] = [];                              // Can scale with a DB to store messages
  private rooms = new Map<string, Set<string>>();                             // Maps room name to a set of socketIDs
  private socketMap = new Map<string, { room: string; username: string }>();  // Maps socketID to room and username
  
  constructor(
    @Inject(forwardRef(() => ChatGateway)) 
    private readonly chatGateway: ChatGateway,
  ) {}

  addUserToRoom(room: string, username: string, socketId: string) {           // Stores user by socketID on socketMap and rooms
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room).add(socketId);
    this.socketMap.set(socketId, { room, username });
  }

  removeUserBySocket(socketId: string) {                                      // Based on socketID data we delete the user from both maps
    const entry = this.socketMap.get(socketId);                               // returns data for event emissions
    if (!entry) return null;

    const { room, username } = entry;

    const roomSet = this.rooms.get(room);
    if (roomSet) {
      roomSet.delete(socketId);
      if (roomSet.size === 0) {
        this.rooms.delete(room);
      }
    }

    this.socketMap.delete(socketId);
    return { room, username };
  }

  // getUserBySocket(socketId: string): {room: string, username: string} | null  { 
  //   const entry = this.socketMap.get(socketId);
  //   if (!entry) return null;
  //   return entry;
  // }

  getUserCount(room: string): number {                                          // Returns the number of users in a certain room
    return this.rooms.get(room)?.size ?? 0;
  }

  prepareMessage(dto: SendMessageDto): ChatMessage {                            // Receives a message and adds the timestamp and ID
    const newMessage: ChatMessage = {
      ...dto,
      id: randomUUID(),
      timestamp: Date.now(), 
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }

  @OnEvent('user.left')                                                         // Listens to user.left event, backend to backend
  handleUserLeft(payload: { room: string, username: string, count: number }) {  // Broadcast the new user count and userStatusUpdate to frontend
    const { room, username, count } = payload;

    // Use this.chatGateway.server to reach the sockets
    this.chatGateway.server.to(room).emit('userCount', { count });

    this.chatGateway.server.to(room).emit('userStatusUpdate', {
      message: `${username} has disconnected`,
      type: 'LEAVE',
      username
    });
  }

  resetState() {                                                                  // For testing purposes, resets memory state of the service
    this.socketMap.clear();
    this.rooms.clear();
  }
}


