// app.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller'; // Adjust path
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [],
  controllers: [ChatController], 
  providers: [ChatGateway, ChatService],
})
export class AppModule {}