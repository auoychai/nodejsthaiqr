
const   errors = require('restify-errors');

// const   mc = require('../app/models/merchant');
const   mcServ = require('../app/services/merchantMgr');

const   notiServ = require('../app/services/notifyMgr');

//const   qrGen = require('../app/services/qrGenerator');

//const   fbToken = require('../app/services/firebaseMgr');

const logger = require('../config/winston');

// var qr = require('qr-image')

module.exports = function(server){


    server.post('/app/opernotify',(req,res,next)=>{

        if(!req.is('application/json')){
            logger.error("Expects 'application/json");
            return next(
                new errors.InvalidContentError("Expects 'application/json"),
            );
        };

        let data = req.body || {};
      
        notiServ.procOperNotify(data);/*.
            catch(((err)=>{
                logger.error('Call-notifyProc-err:',err);
            }));; */

        res.send(data);
        next();

    });

    server.post('/app/selfchekapi',(req,res,next)=>{

        if(!req.is('application/json')){
            logger.error("Expects 'application/json");
            return next(
                new errors.InvalidContentError("Expects 'application/json"),
            );
        };

        let data = req.body || {};
      
        logger.debug('--------------------');
        logger.debug('SelfCheckAPI');
        logger.debug('SelfCheckAPI:',data);
        logger.debug('--------------------');

        res.send(data);
        next();

    });

    server.get('/app/qrpaidhistory',(req,res,next)=>{

    /*
        if(!req.is('application/json')){
            logger.error("Expects 'application/json");
            return next(
                new errors.InvalidContentError("Expects 'application/json"),
            );
        };
    */
       // let data = req.body || {};
      
        mcServ.getQRPaidHistory().then((data)=>{

            res.send(data);
            next();
        });

/*
        res.send(data);
        next();
*/
    });


}