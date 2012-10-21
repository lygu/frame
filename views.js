var helper = require("./helper");
function index(request,response){
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("Hello,index");
    response.end();
}
function start(request,response){
    response.writeHead(200,{"Content-Type":"text/plain"});
    if(request.GET&&request.GET["name"]&&request.GET["p"]){
        response.write("hello,start "+request.GET["name"]+","+request.GET["p"]);
        response.end();
    }
    else{
        response.write("Hello,start");
        response.end();
    }
}
function html(request,response){
    helper.render("./hehe.ejs",{title:"笑",supplies:["呵呵","哈哈","嘻嘻"]},response);
}

exports.start = start;
exports.index = index;
exports.html = html;
