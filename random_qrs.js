var fs = require('fs'),
    request = require('request');
const sha256 = require('sha256');

 var download =  function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

for (let index = 301; index <= 500; index++) {
    
     download(`https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${sha256(index.toString())}&choe=UTF-8`, `QR_CODES/${index}.png`, function(){
        
        console.log(index)
        console.log('done');

    });
}

