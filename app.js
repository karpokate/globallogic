var http = require ('http')
var fs = require('fs')

var server = http.createServer(function(req, res){
    console.log('request was made:' + req.url);
    res.writeHead(200, {'Content-Type':'text/html'});
    var MyReadSteame = fs.createReadStream(__dirname+ './test.html','utf8');
    MyReadSteame.pipe(res);
});

server.listen(3000, '127.0.0.1');
console.log('check port 3000')