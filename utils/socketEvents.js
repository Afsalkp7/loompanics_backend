// socketEvents.js
export default (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
  
      // Join room event (room should be user-specific, e.g., user ID)
      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });
  
      // Handle receiving a message and broadcasting it to the room
      socket.on('sendMessage', (message) => {
        io.to(message.room).emit('receiveMessage', message);
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };
  