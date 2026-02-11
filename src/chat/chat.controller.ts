import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ChatController {
  @Get()
  @Render('index') // Renders views/index.ejs
  getChatPage() {
    return { title: 'NestJS Chat' };
  }
}