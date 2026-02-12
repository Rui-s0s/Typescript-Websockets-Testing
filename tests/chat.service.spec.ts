import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../src/chat/chat.service';
import { ChatGateway } from '../src/chat/chat.gateway';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: ChatGateway,
          useValue: {
            server: {
              to: jest.fn().mockReturnThis(),
              emit: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareMessage', () => {
    it('should return a message object with a valid numeric timestamp', () => {
      const dto = { room: 'general', username: 'Alice', message: 'Hello' };
      const result = service.prepareMessage(dto);

      // We check that the timestamp is a number (essential for our [HH:MM:SS] logic)
      expect(typeof result.timestamp).toBe('number');
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should preserve the sender username so the client can check "isMe"', () => {
      const dto = { room: 'general', username: 'Alice', message: 'Hello' };
      const result = service.prepareMessage(dto);

      expect(result.username).toBe('Alice');
    })});
    
  describe('getUserCount', () => {
    it('should start with 0 users in a room', () => {
      expect(service.getUserCount('room1')).toBe(0);
    });
    
    it('should increase count when user joins', () => {
      service.addUserToRoom('room1', 'john', 'socket1');
    
      expect(service.getUserCount('room1')).toBe(1);
    });
    
    it('should track multiple users', () => {
      service.addUserToRoom('room1', 'john', 'socket1');
      service.addUserToRoom('room1', 'mary', 'socket2');
    
      expect(service.getUserCount('room1')).toBe(2);
    });
    
    it('should decrease count when user leaves', () => {
      service.addUserToRoom('room1', 'john', 'socket1');
      service.removeUserBySocket('socket1');
    
      expect(service.getUserCount('room1')).toBe(0);
    });
  })
})