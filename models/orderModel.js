import mongoose from 'mongoose';
const orderedProductSchema = new mongoose.Schema({
    bookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Books',
        required : true
    },
    quantity : {
        type : Number,
        required : true ,
        default : 1
    }
})
const orderedItemsSchema = new mongoose.Schema({
    products : [orderedProductSchema],
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    totalAmount : {
        type : Number
    },
    status : {
        type : String
    },
    orderedDate : {
        type : Date
    }
})
const orderSchema = new mongoose.Schema ({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    orderedItems : [orderedItemsSchema]
})

export const Order = mongoose.model('Order', orderSchema);