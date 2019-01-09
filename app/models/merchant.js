const   mongoose = require('mongoose');
const   mongooseStringQuery = require('mongoose-string-query');
const   timestamps = require('mongoose-timestamp');
const   relationship = require("mongoose-relationship");

const   user = require('./user');

const TerminalSchema = new mongoose.Schema({

    terminalId:{
        type:String,
        required:true,
        trim:true,
    },
    bsntype:{
        type:String,
        required:true,
        enum:['person','commerce'],
        /* ลูกค้าลงทะเบียนในกลุ่มใด Tag29 , Tag30  */
    },
    pptype:{
        type:String,
        required:true,
        enum:['mobile','nid','taxid','ewall'],
        /* ลงทะเบียน Promptpay ด้วยประเภทเบอร์อะไร เช่น เบอร์มือถือ */
    },
    ppcode:{
        type:String,
        required:true,
        trim:true,
        des:"prompt code for receive money from customer"
        /*  Promptpay Account Code */
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
    termtype:{
        type:String,
        required:true,
        trim:true,
        des:"terminal type can be Mobile or Arduino"
    },
    status:{
        type:String,
        required:true,
        enum:['pending','active','inactive'],
        default:'active',
    },
    store:{type:mongoose.Schema.Types.ObjectId, ref:'Store',childPath:"terminal"},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User',childPath:"terminal"},
    
},
{ minimize:false},
);
TerminalSchema.plugin(relationship,{relationshipPathName:'store'});
TerminalSchema.plugin(relationship,{relationshipPathName:'user'});

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
    /*
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
    */
    zone:{
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
    status:{
        type:String,
        required:true,
        enum:['pending','active','inactive'],
        default:'active',
    },
    terminal:[{type:mongoose.Schema.Types.ObjectId, ref:'Terminal'}],
    merchant:{type:mongoose.Schema.Types.ObjectId, ref:'Merchant',childPath:"store"},
},
{ minimize:false},
);
StoreSchema.plugin(timestamps);
StoreSchema.plugin(mongooseStringQuery);
StoreSchema.plugin(relationship,{relationshipPathName:'merchant'});

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
    hook_key:{
        type:String,
        trim:true,
        default:''
    },
    store:[{type:mongoose.Schema.Types.ObjectId, ref:'Store'}],
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User',childPath:"merchant"},
    
},
{ minimize:false},
);
MerchantSchema.plugin(relationship,{relationshipPathName:'user'});

MerchantSchema.plugin(timestamps);
MerchantSchema.plugin(mongooseStringQuery);

const Merchant = mongoose.model('Merchant',MerchantSchema);

module.exports.Merchant = Merchant;

