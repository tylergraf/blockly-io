const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = `${__dirname}/public/index.html`;

const server = express()
  .use('/public',express.static('public'))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
io.set('transports', ['websocket']);

const Game = require('./game-server.js');
const games = [new Game()];
io.on('connection', function(socket) {
  socket.on("hello", function(data, fn) {
    //TODO: error checking.
    if (data.name && data.name.length > 32)
      fn(false, "Your name is too long!");
    else if (!games[0].addPlayer(socket, data.name))
      fn(false, "Game is too full!");
    else
      fn(true);
  });
  socket.on("checkConn", function(fn) {
    fn();
  });
});


function tick() {
  games[0].tickFrame();
  setTimeout(tick, 1000 / 60);
}
tick();
