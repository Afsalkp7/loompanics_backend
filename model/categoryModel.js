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
    isDeleted: {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date
    }

})

export const Category = mongoose.model('Category', categorySchema);