// socketEvents.js
import Message from '../model/Message.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room event - using user ID as a room identifier
    socket.on('joinRoom', async ({ userId, adminId }) => {
      const room = `chat-${userId}-${adminId}`;
      socket.join(room);
      console.log(`User joined room: ${room}`);

      // Retrieve past messages for the room and send them to the user
      const pastMessages = await Message.find({ room }).sort({ timestamp: 1 });
      socket.emit('loadMessages', pastMessages);
    });

    // Handle receiving a message and broadcasting it
    socket.on('sendMessage', async (message) => {
      const { room, text, sender } = message;

      // Save the message to the database
      const newMessage = new Message({
        room,
        sender,
        text,
      });

      await newMessage.save();

      // Broadcast the message to the room
      io.to(room).emit('receiveMessage', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
