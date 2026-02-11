import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { io, Socket } from 'socket.io-client';

import { ChatGateway } from '../chat.gateway';
import { ChatService } from '../chat.service';

describe('ChatGateway (integration)', () => {
  let app: INestApplication;
  let clientSocket: Socket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, ChatService],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));

    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const port = typeof address === 'string' ? 80 : address.port;

    clientSocket = io(`http://localhost:${port}`);

    await new Promise<void>((resolve) => {
      clientSocket.on('connect', () => resolve());
    });
  });

  afterAll(async () => {
    clientSocket.close();
    await app.close();
  });

  it('should increment user count when a user joins a room', (done) => {
    clientSocket.on('userCount', (data) => {
      expect(data.count).toBe(1);
      done();
    });

    clientSocket.emit('joinRoom', {
      username: 'TestUser',
      room: 'Room1',
    });
  });
});
