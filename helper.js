var http = require("http");
var ejs = require("ejs");
var fs = require("fs");
var path = require("path");
function Helper(){

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
exports.Helper = Helper;
//exports.solveStaticFile = solveStaticFile;
