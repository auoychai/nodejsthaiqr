
const errors = require('restify-errors');
const qrConfig = require('../config/qrppay');
// const   mc = require('../app/models/merchant');

const logger = require('../config/winston');

const  notifyMgr = require('../app/services/notifyMgr');

module.exports = function (server) {

    const apiPrefix = "/api/esp"

    server.post(apiPrefix + '/paidnotify', (req, res, next) => {

        res.contentType = 'json';

        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json"),
            );
        };

        let data = req.body || {};
        
    
        try{

            notifyMgr.procFinNotify(data).then((ret) => {

                logger.debug('Test-ret:',ret);
                //res.contentType = 'json';
                //var json = JSON.stringify(data);
                res.status(200);
                res.send(ret);
                next();
            }).catch(((err)=>{
                logger.error('Call-notifyProc-err:',err);
            }));

        }catch(err){

            let result={
                res_code:"200",
                res_desc:""
            };

            result.res_desc="Error , Uncatch-exception"
            res.status(200);
            
            logger.debug('uncatch-exception:',err);
            //var json = JSON.stringify(data);
             res.send(result);
             next();

        }
    });
}