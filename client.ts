import { io } from 'socket.io-client';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
})

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  socket.emit('joinRoom', {
    room: 'general',
    username: 'alice',
  });

  socket.emit('sendMessage', {
    room: 'general',
    username: 'alice',
    message: 'hello world',
  });
});

socket.on('newMessage', (msg) => {
  console.log(msg);
});

rl.on('line', line => {
  const msg = line.trim();

  if (!msg) {
    rl.prompt();
    return;
  }

  if (msg.toLowerCase() === 'exit') {
    console.log('[🔚] Disconnecting...');
    process.exit(0);
    rl.close();
    return;
  }

  // Mandamos datos al servidor para que maneje en su evento
  socket.emit('sendMessage', {
    room: 'general',
    username: 'alice',
    message: msg,
  });
  rl.prompt();
});
