
const   config = require('../config/config');
const   mongoose = require('mongoose');
const   mongodb = require('mongodb').MongoClient;

const   Todo = require('../app/models/todo');

const   mc = require('../app/models/merchant');
//const   Merchant = require('../app/models/merchant');
//const   Store = require('../app/models/store');
//const   Terminal = require('../app/models/terminal');


mongoose.Promise = global.Promise;
//mongoose.connect(config.db.uri, {useMongoClient:true});


mongoose.connect(config.db.uri,config.options);

const  db = mongoose.connection;



db.on('error',(err)=>{



    console.error(err);
    process.exit(1);
});

db.once('open',()=>{
    
    console.log('MongoosDB-Started')



    var  sequenceDocument = db.qrpaidlog_seq.findAndModify({
        query:{_id:"tid"},
        update:{$inc:{sequence_value:1}},
        new:true
    });
    console.log('SEQ:',sequenceDocument.sequence_value);

    


/*
    mc.Store.apiQuery({}, function(err,docs){
        if(err){
            console.error(err);
            return next( 
                new errors.InvalidContentError(err.errors.name.message)
            );
        }
        console.log(docs);
    })
*/

    console.log('MongoosDB-End')
    



});






process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  });


