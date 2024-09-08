export default function socketEvents(io) {
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
  
      // Handle user joining a room
      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });
  
      // Handle receiving a message and broadcasting it
      socket.on('sendMessage', (message) => {
        io.to(message.room).emit('receiveMessage', message);
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  