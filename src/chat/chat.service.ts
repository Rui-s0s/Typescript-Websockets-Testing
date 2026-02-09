import { ChatMessage, SendMessagePayload } from './chat.types';

export class ChatService {
  createMessage(payload: SendMessagePayload): ChatMessage {
    return {
      room: payload.room,
      username: payload.username,
      message: payload.message,
      timestamp: Date.now(),
    };
  }
}
