import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    otp : {
        type : Number
    }
})

export default mongoose.model('Admin', adminSchema);