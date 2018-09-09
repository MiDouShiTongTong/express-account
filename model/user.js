const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/new', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    bio: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: '/public/img/default-avatar.png'
    },
    status: {
        type: Number,
        /*
            用户状态
                0 - 没有不良状态
                1 - 不能可以评论
                2 - 用户不能登陆

         */
        enum: [0, 1, 2],
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);