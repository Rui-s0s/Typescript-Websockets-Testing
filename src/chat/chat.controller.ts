import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ChatController {
  @Get()
  @Render('index') 
  getChatPage() {
    return { title: 'NestJS Chat' };
  }
}