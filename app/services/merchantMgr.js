const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient;

const mc = require('../models/merchant');
const qrPaidMod = require('../models/qrpaidlog');
const logger = require('../../config/winston');
// module.exports = {
const self = {

    newMerchant: async (data) => {


        try {

            logger.debug('data:', data);
            logger.error('data.store[0]:', data.store[0]);
            let t_store = data.store[0];
            logger.debug('t_store:', t_store);
            data.store = null;

            let merchant = await new mc.Merchant(data).save();
            logger.debug('merchant:', merchant);

            t_store.merchant = merchant.id;
            logger.debug('t_store:', t_store);
            let store = await new mc.Store(t_store).save();

            data.store = [store];

            logger.debug('data:', data);

        } catch (err) {

            logger.error('newMerchant:', err);
        }

        return data;

    },
    getMerchatByVerify: async (data) => {
        // เจอหรือไม่เจอ -> true / false 
        //  MerchantID + StoreID + TerminalID ต้องถูกต้องได้ข้อมูล
        // info: PromptPay-AccountID , StoreID , TerminalID

        var t_obj = {
            status: false,
            message: 'merchant not available',
            data: {
                merchant: 't_merchant',
                store: 't_store',
                terminal: 't_terminal'
            }
        };

        var result = [];
        logger.debug('getMerchant2Pay:', data.merchantId);

        try {

            let merchant = await mc.Merchant.find({ 'merchantId': data.merchantId }).
                where('status').equals('active').
                lean().
                exec();
            // logger.debug('merchant:', merchant);
            logger.debug('merchant:', merchant);

            if(typeof merchant === 'undefined'){

                return t_obj;
            }

            let store = await mc.Store.find({ 'storeId': data.storeId }).
                where('merchant').equals(merchant[0]._id).
                where('status').equals('active').
                lean().
                exec();
            logger.debug('store:', store);
            logger.debug('store[0].id:', store[0]._id);

            if(typeof store === 'undefined'){
                
                return t_obj;
            }

            let terminal = await mc.Terminal.find({ 'terminalId': data.terminalId }).
                where('store').equals(store[0]._id).
                where('status').equals('active').
                lean().
                exec();

            logger.debug('data.terminalId:', data.terminalId);

            if ((typeof merchant !== 'undefined' && merchant.length > 0) &&
                (typeof store !== 'undefined' && store.length > 0) &&
                (typeof terminal !== 'undefined' && terminal.length > 0)) {


                t_merchant = merchant[0];
                t_store = store[0];
                t_terminal = terminal[0];

                console.log('t_merchant:',t_merchant);
                console.log('t_store:',t_store);
                console.log('t_terminal:',t_terminal);



                t_obj = {
                    status: true,
                    message: 'success',
                    data: {
                        merchant: t_merchant,
                        store: t_store,
                        terminal: t_terminal
                    }
                };

            }

        } catch (err) {

            logger.error('getMerchatByVerify:', err);
        }

        return t_obj;
    },
    getMerchatInfo: async (merchantId) => {

        var result = {};
        
        logger.debug('merchantId:',merchantId);
        try {

            let merchant = await mc.Merchant.find({ 'merchantId':merchantId }).
                where('status').equals('active').
                lean().
                exec();
            // logger.debug('merchant:', merchant);
            // logger.debug('merchant:', merchant);

            if ((typeof merchant !== 'undefined' && merchant.length > 0)) {
                
                return merchant[0];
            }else{
                return result;
            }

        } catch (err) {

            logger.error('getMerchatInfo:', err);
            return result;
        }

    },
    getTerminalInfo: async (terminalId) => {

        var result = {};
        
        logger.debug('terminalId:',terminalId);
        try {

            let terminal = await mc.Terminal.find({ 'terminalId':terminalId }).
                where('status').equals('active').
                lean().
                exec();
            // logger.debug('In-getTerminalInfo:', terminal);
            // logger.debug('merchant:', merchant);

            if ((typeof terminal !== 'undefined' && terminal.length > 0)) {
                
                return terminal[0];
            }else{
                return result;
            }

        } catch (err) {

            logger.error('getTerminalInfo:', err);
            return result;
        }

    },
    checkNotifyTxn: async (txnProxyId) => {

        try {

            let qrPaidInfo = await qrPaidMod.QRPaidLog.find({ txnProxyId: txnProxyId }).
                where('pStatus').equals(false).
                exec();

            //console.log('Degug-qrPaidInfo:',qrPaidInfo);
            //console.log('Degug-qrPaidInfo-len:',qrPaidInfo.length);

            return qrPaidInfo;
            /*
            if (qrPaidInfo.length > 0) {

                return true;
            } else {
                return false;
            }
            */

        } catch (err) {

            let qrPaidInfo = {};

            logger.error(err);
            return qrPaidInfo;
        }
    },
    setQRLogA2Paid: async (txnProxyId) => {

        /*
            var qrPaidInfo;
            var message = {
                status: false,
                data: {}
            };
        */
        try {

            qrPaidInfo = await qrPaidMod.QRPaidLog.update(
                { txnProxyId: txnProxyId }, { $set: { pStatus: true } }).exec();

            logger.debug('setQRLogA2Paid:', qrPaidInfo);

        } catch (err) {
            logger.error(err);
        }

        return qrPaidInfo;
    },
    getQRPaidHistory: async () => {

        try {

            let qrPaidInfo = await qrPaidMod.QRPaidLog.find({}).
                where('pStatus').equals(false).
                exec();

            return qrPaidInfo;
    

        } catch (err) {

            let qrPaidInfo = {};

            logger.error(err);
            return qrPaidInfo;
        }
    },

}

module.exports = self;