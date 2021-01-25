const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

// указываем, что приложение может получать json данные (для req в add.post)
app.use(express.json());

const rooms = new Map();

app.get('/rooms', (req, res) => res.json(rooms));

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map([
      ['users', new Map()],
      ['messages', []]
    ]));
  }

  res.send();
});

io.on('connection', (socket) => {

  // получаем socket-запрос
  socket.on('ROOM: JOIN', ({ roomId, userName }) => {
    // сокет отправляется в конкретную комнату, а не во все
    socket.join(roomId);

    // сохраняем конкретного пользователя
    rooms.get(roomId).get('users').set(socket.id, userName);

    // получаем всех пользователей в комнате
    const users = [...rooms.get(roomId).get('users').values()];

    // отправляю в конкретную комнату (to) уведомление (emit), которое все увидят, кроме меня (broadcast), что в комнату подключился конкретный пользователь 
    socket.to(roomId).broadcast.emit('ROOM: JOINED', users);
  });

  console.log("user connected", socket.id);
});

server.listen(9999, (err) => {
  if (err) throw Error(err);
  console.log('Сервер запущен!');
});