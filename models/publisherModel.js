import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
    publisherName : {
        type : String,
        required : true
    },
    publisherAddress : {
        type : String
    },
    publisherWebSiteUrl : {
        type : String
    }
})

export const Publisher = mongoose.model('Publisher', publisherSchema);