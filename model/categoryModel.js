import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date
    },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Books' }]
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);