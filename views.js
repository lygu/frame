var ejs = require("ejs");
var fs = require("fs");
var helper = require("./helper").Helper;
var mime = require("./mime").type;
function index(response){
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("Hello,index");
    response.end();
}
function start(response,GET){
    response.writeHead(200,{"Content-Type":"text/plain"});
    if(GET&&GET["name"]&&GET["p"]){
        response.write("hello,start "+GET["name"]+","+GET["p"]);
        response.end();
    }
    else{
        response.write("Hello,start");
        response.end();
    }
}
function html(response){
    helper.render("./hehe.ejs",{title:"笑",supplies:["呵呵","哈哈","嘻嘻"]},response);
}
function staticHandler(response){

}
exports.start = start;
exports.index = index;
exports.html = html;
exports.staticHandler = staticHandler;