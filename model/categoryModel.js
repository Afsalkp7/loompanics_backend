import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
})

export const Category = mongoose.model('Category', categorySchema);