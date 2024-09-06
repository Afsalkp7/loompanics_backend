import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    subject: {
      type: String,
      required : true
    },
    message: {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date
    },
    isReplayed : {
        type : Boolean,
        default : false
    }
})

export default mongoose.model('Contact', contactSchema);