var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 2000;
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/tictactoe.html');
});

io.on('connection', function(socket){
  var gameId = null;
  socket.on('create room', function(){
    gameId = Math.random() * 1000000 | 0;
    socket.join(gameId);
    socket.emit('gameId', gameId);
  });

  socket.on('join room', function(joinGameId){
    gameId = joinGameId;
    var roomId = socket.adapter.rooms[joinGameId];
    if (roomId != undefined){
      socket.join(gameId);
      io.sockets.in(gameId).emit('message', 'Let the game begin!');
    }
  });

  socket.on('move', function(id){
    io.sockets.in(gameId).emit('update board', id)
  });

  socket.on('new game', function(){
    io.sockets.in(gameId).emit('start new game');
  });

});

http.listen(port, function(){
  console.log('listening on %d', port);
});
