import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ChatController {
  @Get()
  @Render('index') // Renders views/index.ejs
  getChatPage() {
    // You can pass variables to EJS here
    return { title: 'NestJS Chat' };
  }
}