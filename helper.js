var http = require("http"),
    ejs = require("ejs"),
    fs = require("fs"),
    path = require("path"),
    url = require("url"),
    querystring = require("querystring");
var staticFileUrl = "^/static/";
function Helper(){

}
String.prototype.trim = function(){
    return this.replace(/(^[\\s]*)|([\\s]*$)/g, "");
}
Helper.render = function(url,data,response){
    fs.readFile(url,"utf-8",function(error,content){
        if(!error){
            var content = ejs.render(content,data);
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(content);
            response.end();
        }
    })
}
Helper.solveStaticFile = function(pathname,response){
    var self = this;
    pathname = "." + pathname;
    path.exists(pathname,function(exist){
        if(!exist){
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        }
        else{
            fs.readFile(pathname,"binary",function(error,file){
                if (error) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(error);
                } else {
                    var ext = path.extname(pathname);
                    ext = ext ? ext.slice(1) : 'unknown';
                    var contentType = self.mimeType[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });

                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}
Helper.router = function(request,handle,response,postData) {
    var urlObject = url.parse(request.url);
    var pathname = urlObject.pathname;
    var query = urlObject.query;
    var hasHandled = false;
    //handle with get
    request.cookie = {};
    request.header.cookie && request.headers.cookie.split(";").forEach(function(cookie){
                                 var parts = cookie.split("=");
                                 request.cookie[parts[0].trim()] = (parts[1]||'').trim();
                             });
    if(postData){
        request.POST = querystring.parse(postData);
    }
    else if(query){
        request.GET = {};
        var keyVal = [];
        var queryArray = query.split("&");
        for(var i in queryArray){
            keyVal = queryArray[i].split("=");
            request.GET[keyVal[0]] = keyVal[1];
        }
    }
    console.log(pathname);
    if(pathname.match(staticFileUrl)!=null){
        this.solveStaticFile(pathname,response);
    }
    else{
        for(var key in handle){
            if(pathname.match(key)!=null){
                hasHandled = true;
                handle[key](request,response);
                break;
            }
        }
        if(!hasHandled){
            console.log("request from "+pathname+" has not handled");
        }
    }
}
Helper.createServer = function(port){
    var self = this;
    var urlsHandler = {},settings = {};
    try{
        urlsHandler = require("./urlsHandler");
    }
    catch(e){
    }
    var server = http.createServer(function(request,response){
        if(request.method == "GET"){
            self.router(request,urlsHandler,response);
        }
        else if(request.method == "POST"){
            var postData = "";
            request.setEncoding("utf8");
            request.addListener("data", function(postDataChunk) {
                postData += postDataChunk;
            });
            request.addListener("end", function(){
                self.router(request, urlsHandler,response,postData);
            });
        }
        else{
            console.log("other request method");
        }
                 });
    if(port){
        server.listen(port);
    }
    else{
        server.listen(settings.port);
    }
    return server;
}

Helper.mimeType = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};
module.exports = Helper;
