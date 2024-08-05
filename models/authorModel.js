import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String
    },
    bio : {
        born : Date,
        died : Date,
        penName : String,
        occupation : String,
        notableWorks : Array
    },
    baggedAwards :[{
        awardTitle : String,
        awardYear : Date
    }]
})

export const Author = mongoose.model('Author', authorSchema);