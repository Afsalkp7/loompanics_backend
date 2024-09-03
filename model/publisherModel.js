import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
    publisherName : {
        type : String,
        required : true
    },
    publisherAddress : {
        type : String
    },
    publisherUrl : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }, publisherLogo: {
        type: String, 
        default: '' 
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type: Date
    }
})

export const Publisher = mongoose.model('Publisher', publisherSchema);