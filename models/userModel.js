import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const addressSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required : true
    },
    lastName: {
      type: String,
      required: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: {
      type: String
    },
    pinCode: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
})
const cartSchema = new mongoose.Schema({
    boookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Books',
        required:true
    },
    quantity : {
        type : Number,
        default: 1
    }
})
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: [addressSchema]
    },
    cart: {
        type: [cartSchema]
    },
    isMember: {
        type: Boolean
    },
    memberShipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Membership'
    },
    tookedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Took'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    otp : {
        type : Number
    },
    dateLastLogged: {
        type: Date
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = mongoose.model('User', userSchema);
