const   mongoose = require('mongoose');
const   mongooseStringQuery = require('mongoose-string-query');
const   timestamps = require('mongoose-timestamp');


const QRPaidLogSchema = new mongoose.Schema({

    merchantId:{
        type:String,
        required:true,
        trim:true,
    },
    storeId:{
        type:String,
        required:true,
        trim:true,
    },
    terminalId:{
        type:String,
        required:true,
        trim:true,
    },
    ref1:{
        type:String,
        required:false,
        trim:true,
    },
    ref2:{
        type:String,
        required:false,
        trim:true,
    },
    ref3:{
        type:String,
        required:false,
        trim:true,
    },
    bankCode:{
        type:String,
        required:false,
        trim:true,
    },
    paymethod:{
        type:String,
        required:false,
        trim:true,
    },
    txnProxyId:{
        type:String,
        required:true,
        trim:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    level1:{
        type:String,
        required:false,
        trim:true,
    },
    level2:{
        type:String,
        required:false,
        trim:true,
    },
    bsnType:{
        type:String,
        required:true,
        enum:['person','commerce'],
    },
    ppType:{
        type:String,
        required:true,
        enum:['mobile','nid','taxid','ewall'],
    },
    ppCode:{
        type:String,
        required:true,
        trim:true,
        des:"prompt code for receive money from customer"
    },
    pStatus:{
        type:Boolean,
        required:true,
        default:false,
        des:"For identify it already nock with paid notify back from bank"
    }

},
{ minimize:false},
);

QRPaidLogSchema.plugin(timestamps);
QRPaidLogSchema.plugin(mongooseStringQuery);

const QRPaidLog = mongoose.model('QRPaidLog',QRPaidLogSchema);

module.exports.QRPaidLog = QRPaidLog;


