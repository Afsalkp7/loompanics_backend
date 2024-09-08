// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // Room ID or identifier
  sender: { type: String, required: true }, // Can be 'user' or 'admin'
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', messageSchema);