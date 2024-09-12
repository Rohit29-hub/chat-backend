import mongoose, { Schema } from "mongoose";

const userProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    username: {
        type: String,
        required: [true, 'Username required']
    },
    img: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDsD_blJtJsOwjXmWcxeYoSrW9rOaNBYhK2w&s'
    },
    desc: {
        type: String,
        required: [true, 'Description required']
    }
})

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'User fullname is required.']
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: [true, 'User email should be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        default: null
    },
    messages: {
        type: Map,
        of: [String],
        default: {}
    },
}, { timestamps: true })

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export const User = mongoose.model('User', userSchema);
