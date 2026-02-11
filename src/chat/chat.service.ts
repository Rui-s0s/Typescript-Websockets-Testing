import { ChatMessage } from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';

export class ChatService {
  // Use the Interface for internal storage blueprint
  private readonly messages: ChatMessage[] = [];
  private rooms = new Map<string, Set<string>>();
  private socketMap = new Map<string, { room: string; username: string }>();

  addUserToRoom(room: string, username: string, socketId: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    this.rooms.get(room)!.add(username);
    this.socketMap.set(socketId, { room, username });
  }

  removeUserBySocket(socketId: string): string | null {
    const entry = this.socketMap.get(socketId);
    if (!entry) return null;

    const { room, username } = entry;

    this.rooms.get(room)?.delete(username);
    this.socketMap.delete(socketId);

    return room;
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

  removeUserFromRoom(room: string, username: string) {
    this.rooms.get(room)?.delete(username);
  }
}

