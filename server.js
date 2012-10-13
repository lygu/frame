var http = require("http");
var urlsHandle = require("./urlsHandler");
var router = require("./router");
function start(){
    http.createServer(function(request,response){
        //var urlObject = url.parse(request.url);
        //console.log("Request from " + pathname + " recevied");
        if(request.method == "GET"){
            router.route(request.url,urlsHandle.handle,response);
        }
        else if(request.method == "POST"){
            var postData = "";
            request.setEncoding("utf8");
            request.addListener("data", function(postDataChunk) {
                postData += postDataChunk;
                console.log("Received POST data chunk '"+
                            postDataChunk + "'.");
            });
            request.addListener("end", function(){
                router.rout(request.url, urlsHandle.handle,response,postData);
            });
        }
        else{
            console.log("other request method");
        }
    }).listen(8888);
}
exports.start = start;
