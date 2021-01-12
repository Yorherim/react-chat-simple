const express = require('express');
const useSocket = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = useSocket(server);

const rooms = new Map();

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

io.on('connection', socket => {
  console.log("socket connect", socket);
})

server.listen(9999, (err) => {
  if (err) {
    throw Error(err);
  }

  console.log('Сервер запущен!');
});