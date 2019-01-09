'use strict'
// const   config = require('./config/config');
const   config = require('config');
const   restify = require('restify');
const   mongoose = require('mongoose');
const   fbcon = require('./app/services/firebase-conn');

const   admin = require('firebase-admin');

// const   mongodb = require('mongodb').MongoClient;

const   morgan = require('morgan');
const   logger = require('./config/winston');

require('events').EventEmitter.defaultMaxListeners=0;

const   restfyPlugins   = require('restify-plugins');

/*
var server = restify.createServer({
    name:config.name,
    version:config.version
});
*/

var server = restify.createServer({
    name:config.get('name'),
    version:config.get('version')
});

server.use(restfyPlugins.jsonBodyParser({mapParams:true}));
server.use(restfyPlugins.acceptParser(server.acceptable));
server.use(restfyPlugins.queryParser({mapParams:true}));
server.use(restfyPlugins.fullResponse());

server.use(morgan('combined',{stream:logger.stream}));


//{ keepAlive: 120 ,poolSize: 10}


//const  db = mongoose.connection;

// console.log('YYYYY:',config.get('options'));

// var tmp = config.get('options');

var options = config.get('options');

var  db;
server.listen(config.get('port'),()=>{

    mongoose.Promise = global.Promise;
    //mongoose.connect(config.db.uri, {useMongoClient:true});
    mongoose.connect(config.get('db.uri'),options);

    db = mongoose.connection;

    db.on('error',(err)=>{

        logger.error('Unhandled rejection', err);
        // console.error(err);
        // process.exit(1);
    });

    db.once('open',()=>{
        
        logger.debug('Server is listing on port',config.get('port'));
    });


    db.on('disconnecting', function(){
        console.log('db: mongodb is disconnecting!!!');
    });

    db.on('disconnected', function(){
        console.log('db: mongodb is disconnected!!!');
    });

});

/***** */
require('./routes/appQR')(server);
require('./routes/appNotify')(server);
require('./routes/app')(server);
/***** */


process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    // process.exit(1);
    // next();
  });


server.use(function(err,req,res,next){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('evn') === 'development' ? err : {};

    //add this line to include winston logging
    logger.error(`${err.status||500} - ${err.message} - ${req.originUrl} - ${req.method} - ${req.ip} `);

    // render the error page
    res.status(err.status||500);
    res.render('error');

});

process.on('SIGINT', () => {

    db.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        fbcon.app.delete();
        process.exit(0); 
      }); 

    console.log('Log that Ctrl + C has been pressed');
    // process.exit(0);
  });
