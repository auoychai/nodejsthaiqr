
const   mongoose = require('mongoose');
const   mongooseStringQuery = require('mongoose-string-query');
const   timestamps = require('mongoose-timestamp');
const   relationship = require("mongoose-relationship");

const   mc = require('./merchant');

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
    },
   name: {
        type: String,
        required: false,
        trim: true,
    },
    password: {
        type: String,
        required: false,
        trim: true,
    },
    phone:{
        type: String,
        required: false,
        trim: true,
    },
    appId: {
        type: String,
        required: false,
        trim: true,
    },
    accessKey: {
        type: String,
        required: true,
        trim: true,
    },
    authProvider: {
        type: String,
        required: true,
        trim: true,
    },
    merchant:[{type:mongoose.Schema.Types.ObjectId, ref:'mc.Merchant'}],
    terminal:{type:mongoose.Schema.Types.ObjectId, ref:'mc.Terminal'},
},
    { minimize: false },
);

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
const User = mongoose.model('User', UserSchema);
module.exports.User = User;