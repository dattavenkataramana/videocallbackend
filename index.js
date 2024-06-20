// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const sqlite3 = require('sqlite3').verbose();

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Initialize SQLite Database
// const db = new sqlite3.Database('data.db');

// db.serialize(() => {
//   db.run('CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)');
// });

// // Serve static files from the React app
// app.use(express.static('public'));

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('join', (roomId) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('user-joined', socket.id);
//   });

//   socket.on('offer', (data) => {
//     socket.to(data.to).emit('offer', data);
//   });

//   socket.on('answer', (data) => {
//     socket.to(data.to).emit('answer', data);
//   });

//   socket.on('candidate', (data) => {
//     socket.to(data.to).emit('candidate', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize SQLite Database
const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)');
});

// Serve static files from the React app
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);

    socket.on('offer', (data) => {
      socket.to(data.to).emit('offer', {
        from: socket.id,
        offer: data.offer
      });
    });

    socket.on('answer', (data) => {
      socket.to(data.to).emit('answer', {
        from: socket.id,
        answer: data.answer
      });
    });

    socket.on('candidate', (data) => {
      socket.to(data.to).emit('candidate', {
        from: socket.id,
        candidate: data.candidate
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
