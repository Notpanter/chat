const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    content:{
        type:String,
        required: true
    }
},
{timestamps: true});

module.exports = mongoose.model('Post', postSchema);