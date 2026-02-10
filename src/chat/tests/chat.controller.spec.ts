import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../chat.controller';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should return the room id from the URL parameters', () => {
    const roomId = 'coding-room';
    const result = controller.getChatPage(roomId); // We expect the method to take a param
    // TYPESCRIPT COMPLAINS BECAUSE THE METHOD DOES NOT EXIST
    
    // We expect the controller to return an object that EJS will use
    expect(result).toEqual({ title: 'NestJS Chat', room: 'coding-room' });
  });
});