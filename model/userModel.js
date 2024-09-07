import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

// Address Schema
const addressSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    address1: {
        type: String,
        required: true,
        trim: true,
    },
    address2: {
        type: String,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    district: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    }
});

// Cart Schema
const cartSchema = new Schema({
    bookId: {  // Fixed typo from 'boookId' to 'bookId'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

// User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,  // Added index for faster querying
    },
    phoneNumber: {
        type: String,  // Changed to String for consistency
        required: true,
        trim: true,
        index: true,  // Added index for faster querying
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: [addressSchema],
    },
    cart: {
        type: [cartSchema],
    },
    wishList : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Books'
    }],
    isMember: {
        type: Boolean,
        default: false,
        index: true,  // Added index for faster querying
    },
    memberShipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
    },
    borrowedBooks: [{  // Changed from 'tookedBooks' to 'borrowedBooks'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Took',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    otp: {
        type: Number,
    },
    createdAt : {
        type : Date
    },
    searchedKeys : [String],
    dateLastLogged: {
        type: Date,
    },
    otpExpires: {
        type: Date,
    },
    isBlocked : {
        type : Boolean,
        default : false
    }
});


export default mongoose.model('User', UserSchema);
