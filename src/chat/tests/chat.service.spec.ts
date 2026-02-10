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
    });
  });
});