import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        reqiured : true
    },
    validityStartDate : {
        type : Date
    },
    validityEndDate : {
        type : Date
    }
})

export const Membership = mongoose.model('Membership', membershipSchema);