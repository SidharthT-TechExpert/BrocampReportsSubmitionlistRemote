const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pairNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    buddies:{
        type:String,
        required:true,
    },
    reportCount: {
        type: Number,
        default: 0
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;