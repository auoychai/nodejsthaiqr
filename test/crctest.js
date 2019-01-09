//var crc = require('crc16-ccitt-node');
//var buffData = new Buffer('ff7878', 'hex');

//var buffData = new Buffer('00020101021129370016A000000677010111011300660000000005802TH53037646304', 'hex');
//Out[7]: '0x8956' 

// Tested => Can not use
    // npm install crc
    // npm install node-crc --save => Python version
    // npm i crc16 --save -> Python version

const crc = require('crc');
 
console.log(crc.crc16xmodem('00020101021129370016A000000677010111011300660000000005802TH53037646304').toString(16));