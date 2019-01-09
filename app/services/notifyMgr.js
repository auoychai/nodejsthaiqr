const axios = require('axios');
const notiLayout = require('../../config/notifyLayout');

const notiLogMod = require('../models/notifyLogs');
const notiPLogMod = require('../models/pNotifyLogs');

const mcdto = require('../services/merchantMgr');

const espUtil = require('../util/util')
const logger = require('../../config/winston');
const gConfig = require('config');
const fbcon = require('./firebase-conn');

const self = {

    procFinNotify: async (srcNotifyData) => {

        var result = {
            stutus: false,
            message: "",
        };

        var devMsg;

        try {

            txnProxyId = srcNotifyData.txnRefNo;
            logger.debug('txnProxyId:', txnProxyId);

            isOurNotify = await mcdto.checkNotifyTxn(txnProxyId);

            if (isOurNotify.length > 0) {

                self.logFinNotifyInfo(srcNotifyData);
                mcdto.setQRLogA2Paid(txnProxyId);

                mcInfo = await mcdto.getMerchatInfo(isOurNotify[0].merchantId);
                termInfo = await mcdto.getTerminalInfo(isOurNotify[0].terminalId);
                // Above to this point to finished log notify process that we got for any source of notify , such as bank or other


                notiInfo = isOurNotify[0];

                // After this point is to notify to our system and 3rd Party process

                devMsg = {

                    msgType: "Paid",  // Paid | Inform
                    ref1: notiInfo.ref1,
                    ref2: notiInfo.ref2,
                    ref3: notiInfo.ref3,
                    amount: notiInfo.amount,
                    status: "true",
                    message: "Thank you",

                    txnProxyID: notiInfo.txnProxyId,
                    txnDate: notiInfo.updatedAt,
                    terminalID: notiInfo.terminalId,
                    cName: "",
                    cAccount: srcNotifyData.fromAccount,
                    cBankCode: srcNotifyData.fromBankName,

                };

            /*
                if (mcInfo.notifymode !== 'API') { // The target to be sending message to including Device

                    devMsg = {

                        msgType: "Paid",  // Paid | Inform
                        ref1: notiInfo.ref1,
                        ref2: notiInfo.ref2,
                        ref3: notiInfo.ref3,
                        amount: notiInfo.amount,
                        status: "true",
                        message: "Thank you",

                        txnProxyID: notiInfo.txnProxyId,
                        txnDate: notiInfo.updatedAt,
                        terminalID: notiInfo.terminalId,
                        cName: "",
                        cAccount: srcNotifyData.fromAccount,
                        cBankCode: srcNotifyData.fromBankName,

                    };

                }
            */
                console.log('devMsg=>Before:', devMsg);
                //logger.info('devMsg=>Before:', devMsg);

                if (mcInfo.notifymode === 'Device') {
                    console.log('In-Device');
                    if (termInfo.termtype !== 'Mobile') {

                        self.sentPaid2DeviceRTDB(isOurNotify[0].terminalId, devMsg);
                    } else {

                        self.sentPaid2DeviceFCM( devMsg, gConfig );

                    }

                } else if (mcInfo.notifymode === 'API') {

                    //logger.debug('In-API');

                    if (mcInfo.urlhook !== '') {
                        self.sentPaid23Party(/*notiInfo, srcNotifyData*/devMsg, mcInfo);

                    };

                } else { // Both Device & API to 3rd Party

                    //logger.debug('In-Both');
                    if (termInfo.termtype === 'Mobile') {
                        // sent notify to mobile with FCM
                        self.sentPaid2DeviceFCM( devMsg, gConfig );

                    } else {

                        //logger.debug('isOurNotify[0].terminalId:', isOurNotify[0].terminalId);
                        self.sentPaid2DeviceRTDB(isOurNotify[0].terminalId, devMsg);
                    }

                    if (mcInfo.urlhook !== '') {
                        self.sentPaid23Party(/*notiInfo, srcNotifyData*/devMsg, mcInfo);

                    }
                }

                result.stutus = true;
                result.message = 'Success';

            } else {

                result.stutus = true;
                result.message = 'Not match any qr payment request as before';
                logger.info('Not match any qr payment request as before');
            }

        } catch (err) {

            result.stutus = false;
            result.message = 'error-exception';
            logger.error('paidNotify-Error:', err);
        }

        return result;
    },
    sentPaid2DeviceFCM: ( devMsg, gConfig ) => {

        var configFCM = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': gConfig.get('fcm_key')
            }
        };

        var fcmMsg = {
            "to": "/topics/" + termInfo.terminalId,
            "priority": "high",
            "notification": {
                "body": "great match!",
                "title": "Portugal vs. Denmark",
                "icon": "myicon",
                "msg": devMsg

            }
        };

         axios.post(gConfig.get('fcm_url'), fcmMsg, configFCM).then((ret) => {
            console.log('sent notify to mobile with FCM:', ret.data);
        });


    },
    sentPaid23Party: (/*notiInfo, srcNotifyData*/p3msgR, mcInfo) => {

    
        //console.log('Raw-Msg-for-Haup:', p3msgR);

        var p3msg = {
            txnProxyID: p3msgR.txnProxyID,
            amount: p3msgR.amount,
            txnDate: p3msgR.txnDate,
            terminalID: p3msgR.terminalID,

            cName: "Wait2SeeSCBNotify",
            cAccount: p3msgR.cAccount,
            cBankCode: p3msgR.cBankCode,
            bRef1: p3msgR.ref1,
            bRef2: p3msgR.ref2,
            bRef3: p3msgR.ref3
        };


    /*
            var p3msg = {
            txnProxyID: notiInfo.txnProxyId,
            amount: notiInfo.amount,
            txnDate: notiInfo.updatedAt,
            terminalID: notiInfo.terminalId,

            cName: "Wait2SeeSCBNotify",
            cAccount: srcNotifyData.fromAccount,
            cBankCode: srcNotifyData.fromBankName,
            bRef1: srcNotifyData.bRef1,
            bRef2: srcNotifyData.bRef2,
            bRef3: srcNotifyData.bRef3
        };
    */

    
        var config3rd = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': mcInfo.hook_key
            }
        };

        //console.log('config3rd:', config3rd);

        //console.log('Msg-for-Haup:', p3msg);

        axios.post(mcInfo.urlhook, p3msg, config3rd).then((ret) => {
            console.log('Post2Operator:', ret.data);
        });

    },
    procOperNotify: (data) => {

        try {

            self.logOperNotifyInfo(data)/*.
            catch((err)=>{
                logger.error(err);
            });; */

            self.sentInform2Device(data)/*.
            catch((err)=>{
                logger.error(err);
            }); */

        } catch (err) {

            logger.error(err);
        }

    },
    logFinNotifyInfo: (data) => {

        try {

            //console.log('logNotifyInfo:',data)
            data.txn_dt = espUtil.isoDtFormat(data.transaction_date, data.transaction_time);

            new notiLogMod.NotifyLogs(data).save().
                catch((err) => {
                    logger.error(err);
                });;

        } catch (err) {
            logger.error(err);
        }
    },
    logOperNotifyInfo: (data) => {

        try {

            //console.log('logNotifyInfo:',data)

            new notiPLogMod.PNotifyLogs(data).save().
                catch((err) => {
                    logger.error(err);
                });

        } catch (err) {
            logger.error(err);
        }
    },
    sentPaid2DeviceRTDB: (terminalID, devMsg) => {

        //console.log('------------------------');
        //console.log('DEBUG-dev-Msg:', devMsg);
        self.sentMsg2RDBFirebase(terminalID, devMsg);
        //var ref = fbcon.app.database().ref(terminalID);

        //console.log('Man Man:');
    },
    sentInform2Device: (notifyData) => {

        let devMsg = {

            txnProxyId: "",
            //txnSeq:171,
            msgType: "Inform",  // Paid | Inform
            ref1: "station-1",
            ref2: "charger-1",
            ref3: "bank-code-and-other",
            amount: 5,
            status: "",
            message: "",

            txnDate: "",
            terminalID: "",
            cName: "",
            cAccount: "",
            cBankCode: "",

        };

        terminalID = notifyData.terminalID;
        devMsg.txnProxyId = notifyData.txnProxyID;
        // txnSeq=notifyData.txnRefNo.substring((notifyData.txnRefNo.length-13),notifyData.txnRefNo.length);

        // devMsg.txnSeq=txnSeq;
        devMsg.ref1 = notifyData.bRef1;
        devMsg.ref2 = notifyData.bRef2;
        devMsg.ref3 = notifyData.bRef3;
        devMsg.amount = notifyData.amount;
        devMsg.status = notifyData.status;
        devMsg.message = notifyData.desc;

        devMsg.txnDate = notifyData.txnDate;
        //devMsg.txnDate = notifyData.updatedAt;
        devMsg.terminalID = notifyData.terminalID;
        /*
        devMsg.cName = "";
        devMsg.cAccount = notifyData.fromAccount;
        devMsg.cBankCode = notifyData.fromBankName;
        */

        console.log('Inform-devMsg:',devMsg);

        self.sentMsg2RDBFirebase(terminalID, devMsg);

        console.log('Man Man:');
    },
    sentMsg2RDBFirebase: (terminalID, devMsg) => {

        try {

            var ref = fbcon.app.database().ref(terminalID + '/');
            ref.push(devMsg);

            /* 25/06/2018: Comment this function because the message getter must take to delete on client site 
            after ther seen  notify
                self.delLast1Q(ref).then((keyDel)=>{
                    console.log('keyDel:',keyDel);
                    var refx = fbcon.app.database().ref(terminalID+'/'+keyDel); // ref.set({});
                    refx.set({});
                    
                 }).catch((err)=>{
                     logger.debug('delLast10-err:',err);
                 });
            */

        } catch (err) {

            logger.error(err);
        }
    },
    delLast1Q: (ref) => {

        var firstPlayerRef = ref.limitToFirst(1);
        return new Promise((resolve, reject) => {


            firstPlayerRef.on("value", function (data) {

                if (data.val() != null) {

                    console.log('DATA:', data.val());
                    delKey = Object.keys(data.val())[0];
                    resolve(delKey);
                } else {
                    resolve(null);
                }

            },
                function (error) {
                    console.log("Error: " + error.code);
                    reject(error);
                });
        });

    }
}
module.exports = self;