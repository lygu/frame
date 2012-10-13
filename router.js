var url = require("url");
var querystring = require("querystring");
var staticFileUrl = "^/static/";
var helper = require("./helper").Helper;
function route(href,handle,response,postData) {
    var urlObject = url.parse(href);
    var pathname = urlObject.pathname;
    var query = urlObject.query;
    var hasHandled = false;
    if(!postData && query){
        var GET = {};
        var keyVal = [];
        var queryArray = query.split("&");
        for(var i in queryArray){
            keyVal = queryArray[i].split("=");
            GET[keyVal[0]] = keyVal[1];
        }
    }
    if(pathname.match(staticFileUrl)!=null){
        helper.solveStaticFile(pathname,response);
    }
    else{
        for(var key in handle){
            if(pathname.match(key)!=null){
                hasHandled = true;
                if(!postData){
                    if(GET){
                        handle[key](response,GET);
                    }
                    else{
                        handle[key](response);
                    }
                }
                else{
                    handle[key](response,POST);
                    var POST = querystring.parse(postData);
                }
            break;
            }
        }
        if(!hasHandled){
            console.log("request from "+pathname+" has not handled");
        }
    }

    /*
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, postData);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
     */
}

exports.route = route;
