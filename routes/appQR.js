
const   errors = require('restify-errors');
const   qrConfig = require('../config/qrppay');
// const   mc = require('../app/models/merchant');
const   mcServ = require('../app/services/merchantMgr');
const   mcQR = require('../app/services/qrGenerator');

const logger = require('../config/winston');
const   apiPrefix="/api/qrpay"

module.exports = function(server){

    server.post(apiPrefix+'/genqr',(req,res,next)=>{


        if(!req.is('application/json')){
            return next(
                new errors.InvalidContentError("Expects 'application/json"),
            );
        };

        var qrConf=Object.assign({},qrConfig);

        let data = req.body || {};
        logger.debug(data);
        
        let tdata = mcQR.genQRCode(data).then((tdata)=>{

            // logger.debug('rout-:',tdata);
            res.send(tdata);
            next();
        }).catch(((err)=>{
            logger.error('Call-genQRCode-err:',err);
        }));
    });

}

/*
    req.on('end', function() {
      res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
      res.end(dataUpper);
    });

*/