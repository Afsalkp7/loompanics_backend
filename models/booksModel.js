import mongoose from 'mongoose';

const replaySchema = new mongoose.Schema({
    replayedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    replayLikedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replayDislikedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  });
  
  const reviewSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comments: { type: String, required: true },
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replay: replaySchema
  });
const bookSchema = new mongoose.Schema({
    Title: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher'
    },
    pudlishenDate: {
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
    discound: {
        type: Number
    },
    awards: { 
        type: Array
    },
    reviews : [reviewSchema]
})

export const Books = mongoose.model('Books', bookSchema);