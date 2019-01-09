const   mongoose = require('mongoose');
const   mongooseStringQuery = require('mongoose-string-query');
const   timestamps = require('mongoose-timestamp');


const PNotifyLogsSchema = new mongoose.Schema({

    txnPartnerID:{
        type:String,
        required:true,
        trim:true,
        default:"na"
    },
    txnProxyID:{
        type:String,
        required:true,
        trim:true,
        default:"na"
    },
   txnDate:{
        type:Date,
        required:true,
        trim:true
    },
    amount:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
        trim:true,
    },
    desc:{
        type:String,
        required:true,
        trim:true,
    },
    terminalID:{
        type:String,
        required:true,
        trim:true,
    },
    bRef1:{
        type:String,
        required:false,
        trim:true,
        default:"na"
    },
    bRef2:{
        type:String,
        required:false,
        trim:true,
        default:"na"
    },
    bRef3:{
        type:String,
        required:false,
        trim:true,
        default:"na"
    },
    srcNotify:{
        type:String,
        required:true,
        trim:true,
        default:"na"
    }
},
{ minimize:false},
);

PNotifyLogsSchema.plugin(timestamps);
PNotifyLogsSchema.plugin(mongooseStringQuery);

const PNotifyLogs = mongoose.model('PNotifyLogs',PNotifyLogsSchema);

module.exports.PNotifyLogs = PNotifyLogs;