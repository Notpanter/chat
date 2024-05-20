const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    requestFrom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    requestTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
},{timestamps: true});

module.exports = mongoose.model('friendRequest', friendRequestSchema);