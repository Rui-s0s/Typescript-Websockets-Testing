import { ChatService } from '../chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    service = new ChatService();
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
      service.addUserToRoom('room1', 'john');
    
      expect(service.getUserCount('room1')).toBe(1);
    });
    
    it('should track multiple users', () => {
      service.addUserToRoom('room1', 'john');
      service.addUserToRoom('room1', 'mary');
    
      expect(service.getUserCount('room1')).toBe(2);
    });
    
    it('should decrease count when user leaves', () => {
      service.addUserToRoom('room1', 'john');
      service.removeUserFromRoom('room1', 'john');
    
      expect(service.getUserCount('room1')).toBe(0);
    });
  })
})