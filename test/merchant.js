const   mongoose = require('mongoose');
const   mongooseStringQuery = require('mongoose-string-query');
const   timestamps = require('mongoose-timestamp');


const TerminalSchema = new mongoose.Schema({

    termId:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
        enum:['pending','active','inactive'],
        default:'active',
    },
    store:{type:mongoose.Schema.Types.ObjectId, ref:'Store'},
    
},
{ minimize:false},
);
TerminalSchema.plugin(timestamps);
TerminalSchema.plugin(mongooseStringQuery);
const Terminal = mongoose.model('Terminal',TerminalSchema);
module.exports.Terminal = Terminal;


//************************************************************ */
const StoreSchema = new mongoose.Schema({

    storeId:{
        type:String,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        required:true,
    },
    tel:{
        type:String,
        required:false,
        trim:true,
    },
    bsntype:{
        type:String,
        required:true,
        enum:['person','commerce'],
    },
    pptype:{
        type:String,
        required:true,
        enum:['mobile','nid','taxid','ewall'],
    },
    ppcode:{
        type:String,
        required:true,
        trim:true,
        des:"prompt code for receive money from customer"
    },
    status:{
        type:String,
        required:true,
        enum:['pending','active','inactive'],
        default:'pending',
    },
    ppbtype:{
        type:String,
        required:true,
        enum:['mobile','nid','taxid','ewall'],
    },
    ppbcode:{
        type:String,
        required:true,
        trim:true,
        des:"prompt code for pay money back to store"
    },
    level1:{
        type:String,
        required:false,
        trim:true,
        des:"label for branch"
    },
    level2:{
        type:String,
        required:false,
        trim:true,
        des:"label for zone"
    },
    secretKey:{
        type:String,
        required:false,
        trim:true,
    },
    terminal:[{type:mongoose.Schema.Types.ObjectId, ref:'Terminal'}],
    merchant:{type:mongoose.Schema.Types.ObjectId, ref:'Merchant'},
},
{ minimize:false},
);
StoreSchema.plugin(timestamps);
StoreSchema.plugin(mongooseStringQuery);
const Store = mongoose.model('Store',StoreSchema);
module.exports.Store = Store;


//************************************************************ */
const MerchantSchema = new mongoose.Schema({

    merchantId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    address:{
        type:String,
        required:true,
        trim:true,
    },
    tel:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
        enum:['pending','active','inactive'],
        default:'active',
    },
    notifymode:{
        type:String,
        trim:true,
        default:'Device',
    },
    urlhook:{
        type:String,
        trim:true,
        default:'',
    },
    store:[{type:mongoose.Schema.Types.ObjectId, ref:'Store'}],
    
},
{ minimize:false},
);

MerchantSchema.plugin(timestamps);
MerchantSchema.plugin(mongooseStringQuery);

const Merchant = mongoose.model('Merchant',MerchantSchema);

module.exports.Merchant = Merchant;

