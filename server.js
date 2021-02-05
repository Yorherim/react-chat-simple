const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 9999;

app.use(express.static('public'));

// указываем, что приложение может получать json данные (для req в add.post)
app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const obj = rooms.has(roomId)
    ? {
      users: [...rooms.get(roomId).get('users').values()],
      messages: [...rooms.get(roomId).get('messages').values()]
    } : { users: [], messages: [] };

  res.json(obj);
});

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
    socket.to(roomId).broadcast.emit('ROOM: SET_USERS', users);
  });

  socket.on('ROOM: NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = { userName, text };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).broadcast.emit('ROOM: NEW_MESSAGE', obj);
  });

  // удаляем пользователя при дисконекте
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).broadcast.emit('ROOM: SET_USERS', users);
      }
    });
  });

  console.log("user connected", socket.id);
});

server.listen(PORT, (err) => {
  if (err) throw Error(err);
  console.log('Сервер запущен!');
});