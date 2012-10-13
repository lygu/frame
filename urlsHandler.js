var views = require("./views");
var handle = {
    "^$":views.index,
    "^/index":views.index,
    "^/start":views.start,
    "^/html":views.html
};

exports.handle = handle;