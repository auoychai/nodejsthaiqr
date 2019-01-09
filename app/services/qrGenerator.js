
const qrConfig = require('../../config/qrppay')
const PythonShell = require('python-shell');

require('babel-polyfill');
var brandedQRCode = require('branded-qr-code');
var PNG = require('pngjs').PNG;
var fs = require('fs');

const mc = require('../models/merchant');
const mcdto = require('../services/merchantMgr');
const espUtil = require('../util/util')
const qrPInfo = require('../models/qrpaidlog');

const fbcon = require('./firebase-conn');

const logger = require('../../config/winston');

// module.exports = {
const self = {

    genQRCode: async (data) => {

        var qrResult = {
            status: "",
            message: "",
            data: ""
        };

        try {
            //console.log('Root-Debug-Data:',data);

            var qrConf = Object.assign({}, qrConfig);
            // logger.debug('QR-Config:',qrConf);

            vMCInfo = await mcdto.getMerchatByVerify(data);
            logger.debug('vMCInfo:', vMCInfo.result);

            

            if (vMCInfo.status == true) {

                qtTxt = await self.buildQRText(data, qrConf, vMCInfo);

                logger.debug('qtTxt-genQRCode:', qtTxt);

                qrBin = await self.write2QR(qtTxt);

                // logger.debug('qrBin-genQRCode:',qrBin);
                /*----------------------------*/
                console.log('qr-req-data:',data);
                qrLogInfo = await self.storeQRReqInfo(data, vMCInfo);

                console.log('QRLogInfo:',qrLogInfo);

                qrResult.status = true;
                qrResult.message = "";
                qrResult.data = qtTxt;
                qrResult.qrinfo = qrBin;
                //qrResult.qrPaidLogId = qrLogInfo._id;
                // qrResult.qrPaidLog = qrLogInfo;
                qrResult.qrPaidProxyId = qrLogInfo.txnProxyId;

            } else {

                qrResult.status = false;
                qrResult.message = "Merchant or Store or Terminal not presented";
                qrResult.data = "";
                qrResult.qrinfo = "";
                // vMCInfo.result==False --> Merchant or Store or Terminal may not active or not present 
            }

        } catch (err) {

            logger.error(err);
            qrResult.status = false;
            qrResult.message = "Merchant or Store or Terminal not presented";
            qrResult.data = "";
            qrResult.qrinfo = "";
        }

        return qrResult;
    },
    buildQRText: async (data, qrConfig, mcInfo) => {

        var qrConf = qrConfig;
        var vMCInfo = mcInfo;
        var mcTag = '';
        var qrTxt = '';

        try {

            id00 = qrConf.t00.id + qrConf.t00.len + qrConf.t00.value;
            logger.debug('id00:', id00);

            id01 = qrConf.t01.id + qrConf.t01.len + qrConf.t01.value;
            logger.debug('id01:', id01);

            mcTag = self.getMCT2930Info(qrConf, vMCInfo, data);
            logger.debug('mc-T29-T30:', mcTag);
            id53 = qrConf.t53.id + qrConf.t53.len + qrConf.t53.value;
            logger.debug('id53:', id53);
            // Amount
            amt = data.amount;
            if (amt.length < 10) {
                qrConf.t54.len_ol = "0" + amt.length;
                logger.debug('amount-len:', qrConf.t54.len_ol);
            } else {
                qrConf.t54.len_ol = amt.length;
            }

            id54 = qrConf.t54.id + qrConf.t54.len_ol + amt;

            logger.debug('id54:', id54);
            //******************* */
            id58 = qrConf.t58.id + qrConf.t58.len + qrConf.t58.value;

            logger.debug('id58:', id58);
            id62 = await self.getT60TermTxnProxyId(vMCInfo, qrConf);

            id63_p1 = qrConf.t63.id + qrConf.t63.len;
            qrAllId = id00 + id01 + mcTag + id58 + id53 + id54 +/*id59+*/id62 + id63_p1;

            //------------
            qrAllId = qrAllId.toUpperCase();

            id63_crc = await self.getCRC16PP(qrAllId);

            id63_crc = id63_crc.toUpperCase();

            logger.debug('id63_crc:', id63_crc);

            qrTxt = qrAllId + id63_crc;

            logger.debug('id63_crc_upper-case:', qrTxt);

        } catch (err) {

            logger.error(err);
            qrTxt = "";
        }

        return qrTxt;
    },
    getMCT2930Info: (qrConfig, mcInfo, data) => {

        var qrConf = qrConfig;
        var vMCInfo = mcInfo;

        var mcTag = '';

        try {

            // businessType = vMCInfo.data.store.bsntype;
            businessType = vMCInfo.data.terminal.bsntype;

            if (businessType === "commerce") {

                tag30 = qrConf.t30;
                v_aid = tag30.v_aid.id + tag30.v_aid.len + tag30.v_aid.value;
                logger.debug('v_aid:', v_aid);
                //ppCode = vMCInfo.data.store.ppcode;  //->
                ppCode = vMCInfo.data.terminal.ppcode;  //->
                v_biller = tag30.v_billerid.id + tag30.v_billerid.len + ppCode;
                logger.debug('v_biller_id::', v_biller);

                v_ref1 = data.ref1;
                logger.debug('ref1:', v_ref1);
                v_ref2 = data.ref2;
                logger.debug('ref2:', v_ref2);


                v_ref1_len = espUtil.len_padding(v_ref1);
                t30_v_ref1 = tag30.v_ref1.id + v_ref1_len + v_ref1;

                v_ref2_len = espUtil.len_padding(v_ref2);
                t30_v_ref2 = tag30.v_ref2.id + v_ref2_len + v_ref2;

                v_value = v_aid + v_biller + t30_v_ref1/*+t30_v_ref2*/;

                tag30.len_ol = espUtil.len_padding(v_value);
                v_Tag30 = tag30.id + tag30.len_ol + v_value;
                //mcName = vMCInfo.data.store.name;  //-->
                mcName = vMCInfo.data.terminal.name;  //-->
                qrConf.t59.len_ol = espUtil.len_padding(mcName);

                id59 = qrConf.t59.id + qrConf.t59.len_ol + mcName;
                logger.debug('id59:', id59);
                mcTag = v_Tag30;
                //mcTag=v_Tag30/*+id59*/+id62;
                logger.debug('tag39:', mcTag);

            } else if (businessType === "person") {

                //ppType = vMCInfo.data.store.pptype;  //-->
                ppType = vMCInfo.data.terminal.pptype;  //-->
                logger.debug('ppType:', ppType);
                tag29 = qrConf.t29;

                ppCode = '';
                v_ppCode = '';

                if (ppType === "mobile") {
                    //0066
                    //ppCode = "0066".concat((vMCInfo.data.store.ppcode).substr(1));  //-->
                    ppCode = "0066".concat((vMCInfo.data.terminal.ppcode).substr(1));  //-->
                    logger.debug('person-mobile-ppCode:', ppCode);
                    v_ppCode = tag29.v_mobile.id + tag29.v_mobile.len + ppCode;

                } else if (ppType === "nid") {

                    //ppCode = vMCInfo.data.store.ppcode; //-->
                    ppCode = vMCInfo.data.terminal.ppcode; //-->
                    logger.debug('person-nid-ppCode::', ppCode);
                    v_ppCode = tag29.v_nid.id + tag29.v_nid.len + ppCode;

                } else if (ppType === "ewall") {

                    //ppCode = vMCInfo.data.store.ppcode;  //-->
                    ppCode = vMCInfo.data.terminal.ppcode;  //-->
                    logger.debug('person-ewall-ppCode:', ppCode);
                    v_ppCode = tag29.v_ewall.id + tag29.v_ewall.len + ppCode;

                } else {
                    v_ppCode="Wrong the promptpay type";
                }

                v_aid = tag29.v_aid.id + tag29.v_aid.len + tag29.v_aid.value;
                v_value = v_aid + v_ppCode;

                if (v_value.length < 10) {
                    tag29.len_ol = "0" + v_value.length;
                } else {
                    tag29.len_ol = v_value.length;
                }

                mcTag = tag29.id + tag29.len_ol + v_value;

            } else {
                mcTag="Wrong the Business Type";
            }

        } catch (err) {
            logger.error('getMCT2930Info-err:',err);
            mcTag="getMCT2930Info-error";
        }


        return mcTag;
    },
    getCRC16PP: async (qrAllTxnIdPart1) => {

        var id63_crc;

        try{

            id63_crc = await self.callCRC16Python(qrAllTxnIdPart1);
            crc16 = id63_crc[0];

            if (crc16.length == 3) {
                id63_crc = "0" + crc16;
            } else if (crc16.length == 2) {
                id63_crc = "00" + crc16;
            } else if (crc16.length == 1) {
                id63_crc = "000" + crc16;
            } else {
                id63_crc = crc16;
            }
            
        }catch(err){
            logger.error('getCRC16PP-err:',err);
            id63_crc="0000";
        }

        return id63_crc;

    },
    callCRC16Python: (data) => {
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './app/crc16',
            args: [data]
        };
        return new Promise((resolve, reject) => {
            PythonShell.run('crc16qrth.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                // logger.debug('finished');
                // logger.debug('results: %j', results);
                logger.debug('results: %j:',results);
                if (err) reject(err);
                else resolve(results);

            });
        });
    },
    write2QR: async (data) => {

        var buffer;
        var buffimg;

        try{

            buffImg = await brandedQRCode.generate({
                text: data,
                ratio: 2, path: __dirname + '/jsicon.png'
            });
    
            logger.debug('bufferimg:', buffImg);
            var png = await PNG.sync.read(buffImg);
            //await logger.debug('png:', png)
    
            var options =  { colorType: 6 };
            buffer = await PNG.sync.write(png, options);

            //logger.debug('buffer:',buffer);
            //return buffer;
            await fs.writeFileSync('./myimge.png', buffer);

        }catch(err){

            logger.error('write2QR:',err);
            buffer = Buffer.from('write2QR-err');
        }

        return buffer.toString('base64');
        
    },
    getT60TermTxnProxyId: async (mcInfo, qrConfig) => {

        var qrConf = qrConfig;
        var vMCInfo = mcInfo;
        var id62;

        try{

            term = vMCInfo.data.terminal;

            qrProxySeq = await espUtil.nextSeqenceId('qrproxyid');
            //logger.debug('txnProxyId:',qrProxySeq);
            strQrProxySeq = '' + qrProxySeq;
            //logger.debug('0strTxnProxyId.length:',strQrProxySeq.length)
            txnProxyId = term.terminalId + (espUtil.strRepeat('0', (13 - strQrProxySeq.length))) + strQrProxySeq;
            //logger.debug('txnProxyId:',txnProxyId);
            //logger.debug('Observed TerminalInfo-1:',vMCInfo.data.terminal);
            terminalId_len = '';
            //v_terminalId = vMCInfo.data.terminal.terminalId+txnProxyId;
            v_terminalId = txnProxyId;
            term.txnProxyId = v_terminalId;

            logger.debug('Terminal+txnProxyId:',txnProxyId);

            terminalId_len = espUtil.len_padding(v_terminalId);
            v_t62Value = qrConf.t62.v_termid.id + terminalId_len + v_terminalId;
            //logger.debug('Terminal+v_t62Value:',v_t62Value)
            qrConf.t62.len_ol = espUtil.len_padding(v_t62Value);
            id62 = qrConf.t62.id + qrConf.t62.len_ol + v_t62Value;
            //logger.debug('v_terminalId:',v_terminalId);
            
        }catch(err){

            logger.error('getT60TermTxnProxyId:',err);
            id62='T60TermTxnProxyId-err';
        }

        return id62;
    },
    storeQRReqInfo: async (data, vMCInfo) => {

        var qrPaidInfo;
 
        var mc = vMCInfo.data.merchant;
        var sto = vMCInfo.data.store;
        var term = vMCInfo.data.terminal;

        xqrInfo = {

            merchantId: mc.merchantId,
            storeId: sto.storeId,
            terminalId: term.terminalId,
            ref1: data.ref1,
            ref2: data.ref2,
            ref3: data.ref3,
            bankCode: data.bankCode,
            paymethod: data.paymethod,
            txnProxyId: term.txnProxyId,
            amount: data.amount,
            /*
            level1: sto.level1,
            level2: sto.level2,
            bsnType: sto.bsntype,
            ppType: sto.pptype,
            ppCode: sto.ppcode
            */
            level1: sto.zone,
            bsnType:term.bsntype,
            ppType: term.pptype,
            ppCode: term.ppcode

        };
        
        // console.log('DEGUG-storeQRReqInfo:',xqrInfo);

        try{

            qrPaidInfo = await new qrPInfo.QRPaidLog(xqrInfo).save();
        }catch(err){

            logger.error('storeQRReqInfo:',err);
        }

        return qrPaidInfo;

    }
}

module.exports = self;

