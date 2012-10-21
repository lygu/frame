var views = require("./views");
module.exports = urlsHandler;

var urlsHandler = {
    "^/$":views.index,
    "^/index":views.index,
    "^/start":views.start,
    "^/html":views.html
};
