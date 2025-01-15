import mongoose from 'mongoose';

const posterSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    startDate : {
        type : Date
    },
    endDate : {
        type : Date
    }
}, { timestamps: true });

export const Poster = mongoose.model('Poster', posterSchema);