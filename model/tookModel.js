import mongoose from 'mongoose';

const tookSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    items : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Book',
            require : true
        },
        quantity : Number,
        addressId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Address'
        },
        tookedDate : Date,
        dueDate : Date,
        returnDate : Date
    }]
})

export const Took = mongoose.model('Took', tookSchema);