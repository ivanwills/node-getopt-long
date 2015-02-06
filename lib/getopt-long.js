
var getoptLong = function() {
};
getoptLong.prototype.version = '0.0.1';

getoptLong.prototype.configure = function() {

    return this;
};

var exports;
exports.get = new getoptLong();
exports.configure = function () {
    return new getoptLong(arguments[0]);
};
