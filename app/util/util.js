const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient;

const mc = require('../models/merchant');
const qrPInfo = require('../models/qrpaidlog');
const seq = require('../models/sequence');

const logger = require('../../config/winston');


const self = {

    len_padding: (data) => {

        var ret = "00";;

        try {

            if ((typeof data !== 'undefined' && data.length > 0)) {


                if (data.length < 10) {

                    ret = "0" + data.length;
                } else {

                    ret = data.length;
                }
            } else {
                ret = "00";
            }

            logger.debug('len_padding:', ret);

        } catch (err) {

            logger.debug(err);
        }

        return ret;
    },
    strRepeat: (str, times) => {

        try {

            if (times > 0) {

                if (typeof str !== 'undefined' && str.length > 0) {

                    // logger.debug('if (typeof str::::');
                    return str.repeat(times);

                } else {

                    return str;
                }

            } else {

                return str;
            }

        } catch (err) {
            logger.error(err);
        }
    },
    nextSeqenceId: async (seq_name) => {

        try {
            v_seq = await seq.Sequence.findByIdAndUpdate({ _id: seq_name }, { $inc: { next: 1 } }, { new: true }).exec();

        } catch (err) {
            logger.error(err);
        }
        return v_seq.next;

    },
    isoDtFormat: (date, time) => {

        var isoDT='1965-01-01T00:00:00.001Z';

        try{

        // 1965-01-10T00:00:00.001Z
        var YYYY = date.substring(0, 4);
        var MM = date.substring(4, 6);
        var DD = date.substring(6, 8);

        date = YYYY + '-' + MM + '-' + DD;
        //logger.debug(date);
        
        var hh = time.substring(0, 2);
        var mm = time.substring(2, 4);
        var ss = time.substring(4, 6);

        time = hh + ':' + mm + ':' + ss + '.000Z';
        //logger.debug(time);

        isoDT = date + 'T' + time;

        logger.debug('isDT:',isoDT);

        }catch(err){
            logger.error(err);
        }

        return isoDT;

    }
}

module.exports = self;