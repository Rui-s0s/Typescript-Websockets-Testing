import { ChatMessage } from './chat.types';
import { SendMessageDto } from './dto/send-message.dto';

export class ChatService {
  // Use the Interface for internal storage blueprint
  private readonly messages: ChatMessage[] = [];

  prepareMessage(dto: SendMessageDto): ChatMessage {
    const newMessage: ChatMessage = {
      ...dto,
      timestamp: Date.now(), 
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }
}

