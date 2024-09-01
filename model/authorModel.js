import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  born: { type: Date },
  died: { type: Date },
  penName: { type: String },
  occupation: { type: String },
  notableWorks: [{ type: String }],
  awards: [
    {
      awardTitle: { type: String },
      awardYear: { type: Date },
    }
  ],
  image: { type: String },
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
