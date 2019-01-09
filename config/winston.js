const   appRoot = require('app-root-path');
const   winston = require('winston');

const   fs = require('fs');
const   env = process.env.NODE_ENV || 'development';
const   logDir = 'logs'

// logger.debug('The Env:',env);

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();


// define the custom settings for each transport ( file , console )

var options = {

    file:{
        level: 'info',
        filename:`${appRoot}/logs/app.log`,
        handleExceptions:true,
        json:true,
        maxsize:5242880,
        maxFiles:5,
        colorize:false,
    },
    console: {
        level:'debug',
        handleExceptions:true,
        json:false,
        colorize:true,
    },
};

// const tsFormat = () => (new Date()).toLocaleTimeString();

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
    transports:[
        /* new winston.transports.File(options.file),*/
        new winston.transports.Console(options.console),
        new(require('winston-daily-rotate-file'))({
            filename:`${logDir}/app.log`,
            timestamp:tsFormat,
            datePattern:'YYYY-MM-DD',
            prepend:true,
            //level:env==='development' ? 'verbose' : 'info'
            level:'debug'
        })
    ],
    exitOnError:false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message,encoding){
        // use the 'info' log level so the output will be picked up by both transports ( file , console )
        logger.info(message);
    },
};

module.exports = logger;