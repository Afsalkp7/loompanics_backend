import mongoose from 'mongoose';

const { Schema } = mongoose; // Destructure Schema from mongoose

const replaySchema = new Schema({
  replayedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  replayLikedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replayDislikedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


const awardSchema = new mongoose.Schema({
    awardTitle: { type: String, required: true },
    year: { type: Number, required: true },
  });

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comments: { type: String, required: true },
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replay: replaySchema
});

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  primaryImageUrl: {
    type: String,
    required: true
  },
  secondaryImageUrl: {
    type: String
  },
  thirdImageUrl: {
    type: String
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  publisherId: {
    type: Schema.Types.ObjectId,
    ref: 'Publisher'
  },
  publicationDate: {
    type: Date
  },
  edition: {
    type: Number
  },
  genres: {
    type: String
  },
  otherDetails: {
    type: Array
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number
  },
  awards: {
    type:  [awardSchema]
  },
  reviews: [reviewSchema],
  isDeleted : {
    type : Boolean,
    default : false
  },
  deletedAt : {
    type : Date
  },
  pages : {
    type : Number
  },
  language : {
    type : String
  },
  copyType : {
    type : String
  }
});

export const Books = mongoose.model('Books', bookSchema);
