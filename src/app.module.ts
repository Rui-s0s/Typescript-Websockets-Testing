// app.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller'; 
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ChatController], 
  providers: [ChatGateway, ChatService],
})
export class AppModule {}