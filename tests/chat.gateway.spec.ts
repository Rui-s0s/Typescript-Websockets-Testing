import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { io, Socket } from 'socket.io-client';
import { ChatGateway } from '../src/chat/chat.gateway';
import { ChatService } from '../src/chat/chat.service';

describe('ChatGateway (integration)', () => {
  let app: INestApplication;
  let port: number;
  let baseUrl: string;
  let clientSocket: Socket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [ChatGateway, ChatService],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.init();

    const server = await app.listen(0);
    port = (server.address() as any).port;
    baseUrl = `http://localhost:${port}`;
  });

  beforeEach(async () => {
    // 1. Reset the Backend State
    const service = app.get(ChatService);
    service.resetState();

    // 2. Create a fresh socket for the test
    clientSocket = io(baseUrl, {
      transports: ['websocket'],
      forceNew: true,
    });

    await new Promise<void>((resolve) => {
      clientSocket.on('connect', resolve);
    });
  });

  afterEach(async () => {
    // 3. Cleanup: Remove listeners and close socket
    if (clientSocket.connected) {
      clientSocket.removeAllListeners();
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not broadcast a message that is too long', (done) => {
    const massiveMessage = 'a'.repeat(5000);
    
    // 1. Set up a listener to ensure the message NEVER arrives
    const failTimeout = setTimeout(() => {
      // If we reach this timeout, it means no message was broadcasted (Success!)
      done();
    }, 1000);

    clientSocket.on('newMessage', () => {
      clearTimeout(failTimeout);
      done(new Error('Server should have blocked this massive message!'));
    });

    // 2. Emit the "bad" data
    clientSocket.emit('sendMessage', {
      room: 'Room1',
      username: 'Spammer',
      message: massiveMessage
    });
  });

  it('should not broadcast when the message is empty', (done) => {
    // 1. Setup a "Success" timer
    // If 1 second passes and we haven't heard 'newMessage', the validation worked.
    const successTimer = setTimeout(() => {
      clientSocket.off('newMessage'); // Clean up listener
      done();
    }, 1000);

    // 2. Setup a listener that fails the test if it hears anything
    clientSocket.on('newMessage', (data) => {
      clearTimeout(successTimer);
      done(new Error('Server broadcasted an empty message! Content: ' + data.message));
    });

    // 3. Emit the "garbage"
    clientSocket.emit('sendMessage', {
      room: 'Room1',
      username: 'TestUser',
      message: '' // EMPTY STRING
    });
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


  it('should notify the observer when the leaver disconnects', (done) => {
  const room = 'Room1';
  const observerSocket = io(`http://localhost:${port}`, { transports: ['websocket'] });

  observerSocket.on('connect', () => {
    // 1. Observer joins first
    observerSocket.emit('joinRoom', { username: 'Observer', room });

    // 2. Observer sets up the ear to the wall
    observerSocket.on('userStatusUpdate', (data) => {
      expect(data.type).toBe('LEAVE');
      expect(data.username).toBe('Leaver');
      observerSocket.close();
      done();
    });

    // 3. Wait a tiny bit to ensure Observer is IN the room, then Leaver joins and leaves
    setTimeout(() => {
      // We use the main clientSocket (from beforeAll) as the leaver
      clientSocket.emit('joinRoom', { username: 'Leaver', room });
      
      // Give it another moment to register the join, then kill the connection
      setTimeout(() => {
        clientSocket.disconnect();
      }, 50);
    }, 50);
  });
})});