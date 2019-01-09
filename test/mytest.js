
require('babel-polyfill');
var brandedQRCode = require('branded-qr-code')

var PNG = require('pngjs').PNG;
var fs = require('fs');


var data = fs.readFileSync('./espree.png');
var png = PNG.sync.read(data);

console.log('data:',data)
console.log('png:',png)

var options = { colorType: 6 };
var buffer = PNG.sync.write(png, options);
fs.writeFileSync('./out.png', buffer);


//var options = {colorType:6};

//var buffer = PNG.sync.write(buffimg,options);

//fs.writeFileSync('./myimge.png',buffer);
