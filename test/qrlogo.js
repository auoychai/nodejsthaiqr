
require('babel-polyfill');
var brandedQRCode = require('branded-qr-code')

var PNG = require('pngjs').PNG;
var fs = require('fs');

// var buffimg =  brandedQRCode.generate({text:'https://www.espree.io/',path:'/DevSpace/Espree/burndi/espree.png'})

var tmp = async(x) => {

    var buffimg;

    console.log('my-x:',x)

    buffimg = await brandedQRCode.generate({text:'https://www.espree.io/',
                    ratio:2,path:'/DevSpace/Espree/burndi/jsicon.png'})
    await console.log('bufferimg:',buffimg)

    var png = await PNG.sync.read(buffimg);

    await console.log('png:',png)

    var options = await {colorType:6};
    var buffer = await PNG.sync.write(png,options);

    //return buffer;
    fs.writeFileSync('./myimge.png',buffer);
}

//var buffimg =  brandedQRCode.generate({text:'https://www.espree.io/',path:'/DevSpace/Espree/burndi/espree.png'})


async function main(){

    let xx = await tmp('Hello');
    console.log('xx:',xx);
    console.log('boo');
}

main();


/*
tmp('Hello').then((result)=>{
    console.log('result:',result);
})
*/


/*
buffimg.then(function(result){

        console.log('bufferimg:',result)

        var png = PNG.sync.read(result);

        console.log('png:',png)

        var options = {colorType:6};
        var buffer = PNG.sync.write(png,options);

        fs.writeFileSync('./myimge.png',buffer);

    }   
)
*/

